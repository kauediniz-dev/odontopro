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
  const [selectdTime, setSelectedTime] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);

  const form = useAppoinmentForm();
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
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
        const dateString = date.toISOString().split("T")[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/schedule/get-appointment?userId=${clinic.id}&date=${dateString}`,
        );
        const json = await response.json();
        setLoading(false);
        return json;
      } catch {
        setLoading(false);
        return [];
      }
    },
    [clinic.id],
  );

  // Efeito que busca horários (Agora com selectedServiceId para não precisar de F5)
  useEffect(() => {
    if (selectedDate && selectedServiceId) {
      fetchBlockedTimes(selectedDate).then((blocked) => {
        setBlockedTimes(blocked);
        const times = clinic.times || [];
        setAvailableTimeSlot(
          times.map((t) => ({ time: t, available: !blocked.includes(t) })),
        );
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
              />
            </Field>

            <Field>
              <FieldLabel>Serviço:</FieldLabel>
              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinic.services.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
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
