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
import { Controller } from "react-hook-form";

interface ScheduleContentProps {
  clinic: Prisma.UserGetPayload<{
    include: { services: true; subscription: true };
  }>;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectdTime, setSelectedTime] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const form = useAppoinmentForm();
  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");

  // Busca o serviço atual para mostrar a duração
  const currentService = clinic.services.find(
    (s) => String(s.id) === String(selectedServiceId),
  );

  const fetchBlockedTimes = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        // CORREÇÃO: Formata a data respeitando o fuso horário local (YYYY-MM-DD)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        const response = await fetch(
          `/api/schedule/get-appointment?userId=${clinic.id}&date=${dateString}`,
        );

        if (!response.ok) throw new Error("Erro na API");

        const json = await response.json();
        setLoading(false);
        return json;
      } catch (err) {
        console.error("Erro ao buscar horários:", err);
        setLoading(false);
        return [];
      }
    },
    [clinic.id],
  );

  // No ScheduleContent.tsx
  useEffect(() => {
    setIsMounted(true);

    const fromUrl = new URLSearchParams(window.location.search).get(
      "serviceId",
    );
    const fromStorage = localStorage.getItem("lastSelectedServiceId");
    const idToRestore = fromUrl || fromStorage;

    // Define a data padrão se estiver vazia
    if (!form.getValues("date")) {
      form.setValue("date", new Date());
    }

    // Restaura o serviço APENAS SE houver algo para restaurar
    if (
      idToRestore &&
      clinic.services.some((s) => String(s.id) === String(idToRestore))
    ) {
      setValue("serviceId", idToRestore);
    }
  }, []); // <--- DEIXE VAZIO AQUI para rodar só no mount

  // Efeito que busca horários (Agora com selectedServiceId para não precisar de F5)
  // Substitua o bloco dos efeitos de busca (linhas 81 até 114) por este:
  useEffect(() => {
    // Se mudar o serviço ou data, resetamos a lista
    setAvailableTimeSlot([]);

    if (selectedServiceId && selectedDate) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        const times = clinic.times || [];
        const finalSlots = times.map((time) => ({
          time: time,
          available: !blocked.includes(time),
        }));
        setAvailableTimeSlot(finalSlots);
      });
    }
  }, [selectedDate, selectedServiceId, fetchBlockedTimes, clinic.times]);

  const handleRegisterAppointment = async (data: AppoinmentFormData) => {
    console.log({ ...data, time: selectdTime });
  };

  return (
    <div className="w-full flex flex-col pb-10">
      <div className="h-32 bg-emerald-500">
        <section className="container mx-auto px-4 mt-15 flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white mb-4">
            <Image
              src={clinic.image || imgTest}
              alt="Clinica"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold">{clinic.name}</h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-5" />
            <span>{clinic.address}</span>
          </div>
        </section>
      </div>

      <section className="max-w-2xl mx-auto w-full mt-58">
        <form
          onSubmit={handleSubmit(handleRegisterAppointment)}
          className="mx-2 space-y-6 bg-white p-6 border rounded-md"
        >
          <FieldGroup>
            <Field>
              <FieldLabel>Nome completo:</FieldLabel>
              <Input {...form.register("name")} />
              {errors.name && (
                <FieldError>{errors.name.message as string}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Email:</FieldLabel>
              <Input {...form.register("email")} />
              {errors.email && (
                <FieldError>{errors.email.message as string}</FieldError>
              )}
            </Field>

            <Field>
              <Label>Telefone:</Label>
              <Input
                {...form.register("phone")}
                onChange={(e) =>
                  setValue("phone", formatPhoneNumber(e.target.value))
                }
              />
              {errors.phone && (
                <FieldError>{errors.phone.message as string}</FieldError>
              )}
            </Field>

            <Field className="flex items-center gap-2">
              <FieldLabel>Data:</FieldLabel>
              <DateTimePicker
                initialDate={selectedDate}
                onChange={(d) => setValue("date", d)}
                className="mx-2 space-y-2 bg-white p-2 border rounded-md"
              />
            </Field>

            <Field>
              <FieldLabel>Serviço:</FieldLabel>
              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      // Força o salvamento imediato para o useEffect de busca reagir
                      localStorage.setItem("lastSelectedServiceId", val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinic.services.map((service) => (
                        <SelectItem
                          key={String(service.id)}
                          value={String(service.id)} // SEMPRE converta para String
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.serviceId && (
                <FieldError>{errors.serviceId.message as string}</FieldError>
              )}
            </Field>

            {selectedServiceId && (
              <Field className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Horários disponíveis:</Label>
                  {currentService && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                      Duração: {Math.floor(currentService.duration / 60)}h{" "}
                      {currentService.duration % 60}min
                    </span>
                  )}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  {loading ? (
                    <p>Carregando...</p>
                  ) : (
                    <ScheduleTimeList
                      onSelectTime={setSelectedTime}
                      selectedDate={selectedDate}
                      selectedTime={selectdTime}
                      requiredSlots={
                        currentService
                          ? Math.ceil(currentService.duration / 30)
                          : 1
                      }
                      blockedTimes={blockedTimes}
                      availableTimeSlot={availableTimeSlot}
                      clinicTimes={clinic.times}
                    />
                  )}
                </div>
              </Field>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-500"
              disabled={
                !selectedServiceId || !selectedDate || !selectdTime || loading
              }
            >
              Agendar
            </Button>
          </FieldGroup>
        </form>
      </section>
    </div>
  );
}
