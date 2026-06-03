"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Prisma } from "lib/generated/wasm";

type AppointmentWithService = Prisma.AppointmentGetPayload<{
  include: {
    service: true;
  };
}>;

interface AppointmentsListProps {
  times: string[];
}

export function AppointmentsList({ times }: AppointmentsListProps) {
  const searchParams = useSearchParams(); // Hook de busca de parâmetros da URL
  const date = searchParams.get("date");

  const { data, isLoading } = useQuery({
    queryKey: ["get-appointments", date], // aqui podemos usar a data como parte da chave para refetch quando a data mudar
    queryFn: async () => {
      // aqui buscamos nossa rota
      let activeDate = date;
      if (!activeDate) {
        // se não tiver data, podemos usar a data atual formatada como YYYY-MM-DD
        const today = format(new Date(), "yyyy-MM-dd");
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/clinic/appointment?date=${activeDate}`;

      const response = await fetch(url);

      const json = (await response.json()) as AppointmentWithService[];

      console.log(json);

      if (!response.ok) {
        return [];
      }

      return json;
    },
  });

  //Montar occupantMap slot > appointment
  // Se um agendamento começa as 15:00 e tem um requiredSlots 2
  // occupantMap ["15:00", appointment], ["15:30", appointment]
  const occupantMap: Record<string, AppointmentWithService> = {}; // Mapa para associar cada slot a um agendamento, se existir

  if (data && data.length > 0) {
    // Preencher os slots com os agendamentos reais
    for (const appointment of data) {
      // calcular quantos slots esse agendamento ocupa
      const requiredSlots = Math.ceil(appointment.service.duration / 30); // Exemplo: se a duração é 60 minutos, ocupa 2 slots de 30 minutos
      // Descobrir o indice do nosso array de horarios esse agendamento começa
      const startIndex = times.indexOf(appointment.time);
      // Se encontrar o index
      if (startIndex !== -1) {
        // Preencher os slots ocupados por esse agendamento
        for (let i = 0; i < requiredSlots; i++) {
          const slotIndex = startIndex + i;
          if (slotIndex < times.length) {
            // Verificar se o índice do slot não ultrapassa o array de horários
            occupantMap[times[slotIndex]] = appointment; // Associa o slot ao agendamento
          }
        }
      }
    }
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold">
          Agendamentos
        </CardTitle>
        <button>SELECIONAR DATA</button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            times.map((slot) => {
              // occupantMap["15:00"]
              const occupant = occupantMap[slot];

              if (occupant) {
                return (
                  <div
                    key={slot}
                    className="flex items-center py-2 border-t last:border-b"
                  >
                    <div className="w-16 text-sm font-semibold">{slot}</div>
                    <div className="flex-1 text-sm text-gray-500">
                      <div className="font-semibold">{occupant.name}</div>
                      <div className="text-sm text-gray-500">
                        {occupant.phone}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={slot}
                  className="flex items-center py-2 border-t last:border-b"
                >
                  <div className="w-16 text-sm font-semibold">{slot}</div>
                  <div className="flex-1 text-sm text-gray-500">Disponível</div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
