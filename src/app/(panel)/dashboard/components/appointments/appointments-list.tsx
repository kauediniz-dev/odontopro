"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Prisma } from "lib/generated/wasm";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { cancelAppointment } from "../../_actions/cancel-appointment";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogAppointment } from "./dialog-appointment";
import { ButtonPickerAppointment } from "./button-date";

export type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: { service: true };
}>;

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [detailAppointment, setDetailAppointment] =
    useState<AppointmentWithService | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_URL}/api/clinic/appointment?date=${date}`;
      const response = await fetch(url);
      if (!response.ok) return [];
      return (await response.json()) as AppointmentWithService[];
    },
    staleTime: 20000, // 20 seconds
    refetchInterval: 60000, // 1 minute
  });

  // Memoriza o mapa para evitar re-cálculos desnecessários
  const occupantMap = useMemo(() => {
    const map: Record<
      string,
      { appointment: AppointmentWithService; isFirstSlot: boolean }
    > = {};

    if (!data) return map;

    data.forEach((appointment) => {
      const requiredSlots = Math.ceil(appointment.service.duration / 30);
      const startIndex = times.indexOf(appointment.time);

      if (startIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;
          if (slotIndex < times.length) {
            map[times[slotIndex]] = {
              appointment,
              isFirstSlot: i === 0, // Marca se é o início do agendamento
            };
          }
        }
      }
    });
    return map;
  }, [data, times]);

  async function handleCancelAppointment(appointment: string) {
    const response = await cancelAppointment({
      appointmentId: appointment,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["get-appointments"] }); // Invalida a consulta
    await refetch(); // Atualiza a lista de agendamentos
    toast.success("Agendamento cancelado com sucesso!");
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl md:text-2xl font-bold">
            Agendamentos
          </CardTitle>
          <ButtonPickerAppointment />
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                Carregando...
              </div>
            ) : (
              times.map((slot) => {
                const occupant = occupantMap[slot];

                return (
                  <div
                    key={slot}
                    className="flex items-center py-3 border-t last:border-b min-h-[60px]"
                  >
                    <div className="w-20 text-sm font-bold text-gray-700">
                      {slot}
                    </div>

                    <div className="flex-1">
                      {occupant ? (
                        // Se for o primeiro slot, mostra os dados. Se não, mostra apenas que está ocupado
                        occupant.isFirstSlot ? (
                          <div className="bg-blue-50 p-2 rounded-md border-l-4 border-blue-500">
                            <div className="font-semibold text-blue-900">
                              {occupant.appointment.name}
                            </div>
                            <div className="text-xs text-blue-700">
                              {(occupant.appointment.service as any).name} •{" "}
                              {occupant.appointment.phone}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic pl-2">
                            (continuação do atendimento...)
                          </div>
                        )
                      ) : (
                        <div className="text-sm text-green-600 font-medium pl-2">
                          Disponível
                        </div>
                      )}
                    </div>
                    <div className="ml-auto">
                      <div className="flex">
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-400"
                            onClick={() =>
                              setDetailAppointment(occupant.appointment)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-500"
                          onClick={() =>
                            handleCancelAppointment(occupant.appointment.id)
                          }
                        >
                          <X className="w-4 h-4 " />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <DialogAppointment appointment={detailAppointment} />
    </Dialog>
  );
}
