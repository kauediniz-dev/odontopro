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

type UserWithServiceAndSubscription = Prisma.UserGetPayload<{
  include: {
    services: true;
    subscription: true;
  };
}>;

interface ScheduleContentProps {
  clinic: UserWithServiceAndSubscription;
}

export function ScheduleContent({ clinic }: ScheduleContentProps) {
  const form = useAppoinmentForm();
  const phoneRegister = form.register("phone");
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
          //   onSubmit={form.handleSubmit(onSubmit)}
          className="mx-2 space-y-6 bg-white p-6 border rounded-md shadow-sm"
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
          </FieldGroup>
        </form>
      </section>
    </div>
  );
}
