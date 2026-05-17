"use client";
import Image from "next/image";
import imgTest from "../../../../../../../public/foto1.png";
import { MapPin } from "lucide-react";
import { Prisma } from "@prisma/client";
import { useAppoinmentForm, AppoinmentFormData } from "./schedule-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPhoneNumber } from "@/utils/Phone";
import { DateTimePicker } from "./date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import { ScheduleTimeList } from "./schedule-time-list";

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscription: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoinmentForm();
  const { watch } = form;

  const selectedDate = watch("date");
  const selectedServiceId = form.watch("serviceId");
  const phoneRegister = form.register("phone");

  const [selectdTime, setSelectedTime] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Horarios bloqueados
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  // Função que busca horarios bloqueados (via fetch HTTP)
  const fetchBlockedTimes = useCallback(
    async (date: Date): Promise<string[]> => {
      setLoading(true);
      try {
        const dateString = date.toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointment?userId=${clinic.id}&date=${dateString}`,
        );
        const json = await response.json();
        setLoading(false);
        return json; // Retorna os horarios bloqueados
      } catch (err) {
        setLoading(false);
        return [];
      }
    },
    [clinic.id],
  );

  useEffect(() => {
    if (selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked);

        const times = clinic.times || [];

        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));

        setAvailableTimeSlot(finalSlots);
      });
    }
  }, [selectedDate, clinic.times, fetchBlockedTimes, selectdTime]);
  return (
    <div className="w-full flex flex-col pb-10">
      <div className="h-32 bg-emerald-500">
        <section className="container mx-auto px-4 mt-15">
          <div className="max-w-2xl mx-auto">
            <article className="flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-4">
                <Image
                  src={clinic.image ? clinic.image : imgTest}
                  alt="Foto da clinica"
                  className="object-cover"
                  fill
                  sizes="192px"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold mb-2 ">{clinic.name}</h1>
              <div className="flex items-center gap-0.2">
                <MapPin className="w-5 h-5" />
                <span className="ml-2">
                  {clinic.address ? clinic.address : "Endereço não informado"}
                </span>
              </div>
            </article>
          </div>
        </section>
      </div>
      {/* Formulario de agendamento */}
      <section className="max-w-2xl mx-auto w-full mt-58">
        <form className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm">
          <FieldGroup className="">
            <Field className="my-2">
              <FieldLabel htmlFor="name" className="font-semibold">
                Nome completo:
              </FieldLabel>
              <Input
                {...form.register("name")}
                placeholder="Digite seu nome completo"
              />

              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>
            <Field className="my-2">
              <FieldLabel className="font-semibold">Email:</FieldLabel>
              <Input
                {...form.register("email")}
                placeholder="Digite seu email..."
              />

              {form.formState.errors.email && (
                <FieldError>{form.formState.errors.email.message}</FieldError>
              )}
            </Field>
            <Field>
              <Label className="font-semibold">Telefone:</Label>

              <Input
                {...phoneRegister}
                placeholder="(XX) XXXXX-XXXX"
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);

                  form.setValue("phone", formattedValue, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />

              {form.formState.errors.phone && (
                <FieldError>{form.formState.errors.phone.message}</FieldError>
              )}
            </Field>

            <Field className="my-2 flex items-center gap-2 space-y-1">
              <FieldLabel htmlFor="date" className="font-semibold">
                Data do agendamento:
              </FieldLabel>

              <DateTimePicker
                initialDate={new Date()}
                className="w-full rounded border p-2"
                onChange={(date) =>
                  form.setValue("date", date, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />

              {form.formState.errors.date && (
                <FieldError>{form.formState.errors.date.message}</FieldError>
              )}
            </Field>
            <Field className="my-2 space-y-1">
              <FieldLabel htmlFor="serviceId" className="font-semibold">
                Selecione o Serviço:
              </FieldLabel>

              <Select
                value={selectedServiceId}
                onValueChange={(value) => {
                  form.setValue("serviceId", value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>

                <SelectContent>
                  {clinic.services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({Math.floor(service.duration / 60)}h{" "}
                      {service.duration % 60}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {form.formState.errors.serviceId && (
                <FieldError>
                  {form.formState.errors.serviceId.message}
                </FieldError>
              )}
            </Field>

            {selectedServiceId ? (
              <Field className="my-2 space-y-1">
                <div className="space-y-2">
                  <Label className="font-semibold">Horarios disponiveis:</Label>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    {loading ? (
                      <p>Carregando horarios...</p>
                    ) : availableTimeSlot.length === 0 ? (
                      <p>Nenhum horario disponivel</p>
                    ) : (
                      <ScheduleTimeList
                        selectedDate={selectedDate}
                        selectedTime={selectdTime}
                        requiredSlots={
                          clinic.services.find(
                            (service) => service.id === selectedServiceId,
                          )
                            ? Math.ceil(
                                clinic.services.find(
                                  (service) => service.id === selectedServiceId,
                                )!.duration / 30,
                              )
                            : 1
                        }
                        blockedTimes={blockedTimes}
                        availableTimeSlot={availableTimeSlot}
                        clinicTimes={clinic.times}
                      />
                    )}
                  </div>
                </div>
              </Field>
            ) : null}

            {clinic.status ? (
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400"
                disabled={
                  !watch("serviceId") ||
                  !watch("date") ||
                  !watch("phone") ||
                  !watch("name") ||
                  !watch("email")
                }
              >
                Agendar
              </Button>
            ) : (
              <p className="bg-red-500 text-white text-center px-4 py-2 rounded-md">
                A clinica esta fechada
              </p>
            )}
          </FieldGroup>
        </form>
      </section>
    </div>
  );
}
