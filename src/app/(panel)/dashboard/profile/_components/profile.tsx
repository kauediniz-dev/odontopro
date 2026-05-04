"use client";
import { useProfileForm } from "./profile-form";
import Image from "next/image";
import imgTest from "../../../../../../public/doctor-hero.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
export function ProfileContent() {
  const form = useProfileForm();

  function onSubmit(data: any) {
    console.log(data);
  }

  return (
    <div className="mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full rounded-r-xl shadow-sm">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden">
                <Image
                  src={imgTest}
                  alt="Foto da clinica"
                  fill
                  sizes="140px"
                  className="object-contain"
                  loading="eager"
                />
              </div>
            </div>
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel>Nome Completo:</FieldLabel>

                <Input
                  {...form.register("name")}
                  placeholder="Digite seu nome completo"
                />

                {form.formState.errors.name && (
                  <FieldError>{form.formState.errors.name.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Endereço Completo:</FieldLabel>

                <Input
                  {...form.register("address")}
                  placeholder="Digite o endereço da clinica"
                />

                {form.formState.errors.address && (
                  <FieldError>
                    {form.formState.errors.address.message}
                  </FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Telefone:</FieldLabel>

                <Input
                  {...form.register("phone")}
                  placeholder="Digite o telefone"
                />

                {form.formState.errors.phone && (
                  <FieldError>{form.formState.errors.phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>

                <Select
                  defaultValue={form.getValues("status")}
                  onValueChange={(value: "ativo" | "inativo") =>
                    form.setValue("status", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Clinica Aberta</SelectItem>
                    <SelectItem value="inativo">Clinica Fechada</SelectItem>
                  </SelectContent>
                </Select>

                {form.formState.errors.status && (
                  <FieldError>
                    {form.formState.errors.status.message}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
