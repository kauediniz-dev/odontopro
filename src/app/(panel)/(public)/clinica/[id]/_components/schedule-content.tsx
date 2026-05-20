"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import { createNewAppointment } from "../_actions/create-appointment";
import { toast } from "sonner";
import { set } from "zod";

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
  const { watch, setValue } = form;

  // 2. Inicialize os hooks de navegação
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedDate = watch("date");
  const selectedServiceId = watch("serviceId");
  const phoneRegister = form.register("phone");
  console.log("selectedServiceId:", selectedServiceId);
  const [selectdTime, setSelectedTime] = useState("");
  const [availableTimeSlot, setAvailableTimeSlot] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Horarios bloqueados
  const [blockedTimes, setBlockedTimes] = useState<string[]>([]);
  useEffect(() => {
    // Ao carregar a página, se o formulário estiver vazio, tenta buscar no "bolso" (localStorage)
    if (!selectedServiceId) {
      const savedId = localStorage.getItem("lastSelectedServiceId");

      // Verifica se o ID salvo pertence a um serviço desta clínica
      if (savedId && clinic.services.some((s) => s.id === savedId)) {
        setValue("serviceId", savedId);
      }
    }
  }, []); // Roda apenas uma vez na montagem

  useEffect(() => {
    // Sempre que o usuário selecionar um serviço, salva no "bolso" e na URL
    if (selectedServiceId) {
      localStorage.setItem("lastSelectedServiceId", selectedServiceId);

      const params = new URLSearchParams(window.location.search);
      if (params.get("serviceId") !== selectedServiceId) {
        params.set("serviceId", selectedServiceId);
        window.history.replaceState(null, "", `?${params.toString()}`);
      }
    }
  }, [selectedServiceId]);

  // 3. Função para atualizar a URL sem recarregar a página
  const updateUrl = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("serviceId", id);
    } else {
      params.delete("serviceId");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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

  useEffect(() => {
    const serviceIdFromUrl = searchParams.get("serviceId");
    const savedServiceId = localStorage.getItem("lastSelectedServiceId");

    // Prioridade: Se tem na URL, usa a URL
    if (serviceIdFromUrl) {
      if (selectedServiceId !== serviceIdFromUrl) {
        setValue("serviceId", serviceIdFromUrl);
        localStorage.setItem("lastSelectedServiceId", serviceIdFromUrl);
      }
    }
    // Se NÃO tem na URL, mas tem salvo no navegador, recupera
    else if (savedServiceId && !selectedServiceId) {
      setValue("serviceId", savedServiceId);
      //  atualiza a URL para manter a consistência
      const params = new URLSearchParams(window.location.search);
      params.set("serviceId", savedServiceId);
      window.history.replaceState(null, "", `?${params.toString()}`);
    }

    // Sempre que o selectedServiceId mudar, salva no localStorage
    if (selectedServiceId) {
      localStorage.setItem("lastSelectedServiceId", selectedServiceId);
    }
  }, [searchParams, selectedServiceId, setValue]);

  async function handleRegisterAppointment(formData: AppoinmentFormData) {
    if (!selectdTime) {
      return;
    }

    const response = await createNewAppointment({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: selectedDate,
      serviceId: formData.serviceId,
      time: selectdTime,
      clinicId: clinic.id,
    });
    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Consulta agendada com sucesso");
    form.reset();
    setSelectedTime("");
  }

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
        <form
          className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
          onSubmit={form.handleSubmit(handleRegisterAppointment)}
        >
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

              <Controller
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      localStorage.setItem("lastSelectedServiceId", val); // Salva aqui também
                      updateUrl(val);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>

                    <SelectContent>
                      {clinic.services.map((service) => (
                        <SelectItem
                          key={service.id}
                          value={String(service.id)} // Garante que seja string
                        >
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

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
                        onSelectTime={(time) => setSelectedTime(time)}
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
                  !watch("email") ||
                  !selectdTime || // Adicionado: só libera se escolher o horário
                  loading // Adicionado: bloqueia enquanto carrega horários
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
