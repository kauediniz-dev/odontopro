"use client";
import { useState } from "react";
import { ProfileFormData, useProfileForm } from "./profile-form";
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
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { Prisma } from "@prisma/client";

type UserWithSubscription = Prisma.UserGetPayload<{
  // Define o tipo UserWithSubscription
  include: {
    subscription: true;
  };
}>;

interface ProfileContentProps {
  user: UserWithSubscription;
}

export function ProfileContent({ user }: ProfileContentProps) {
  // aqui você pode definir as props que o componente vai receber, como os dados do usuário, etc.
  const [selectdHours, setSelectedHours] = useState<string[]>(user.times ?? []);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const form = useProfileForm({
    name: user.name,
    address: user.address,
    phone: user.phone,
    status: user.status,
    timeZone: user.timezone,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  async function onSubmit(values: ProfileFormData) {
    // aqui você pode enviar os dados do formulário para a API ou fazer o que for necessário
    const profileData = {
      ...values,
      times: selectdHours,
    };
    console.log("values:", profileData);
  }

  function generateTimeSlots(): string[] {
    // essa função é apenas um exemplo para gerar os horários, você pode adaptar conforme necessário
    const slots: string[] = [];
    for (let i = 8; i < 20; i++) {
      const hour = i.toString().padStart(2, "0");
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  }

  const slots = generateTimeSlots();

  function toggleHour(hour: string) {
    // essa função toggle o horário selecionado
    setSelectedHours((prev) =>
      prev.includes(hour)
        ? prev.filter((h) => h !== hour)
        : [...prev, hour].sort(),
    );
  }

  const timeZones = Intl.supportedValuesOf("timeZone").filter(
    (zone) =>
      zone.startsWith("America/Sao_Paulo") ||
      zone.startsWith("America/Fortaleza") ||
      zone.startsWith("America/Cuiaba") ||
      zone.startsWith("America/Recife") ||
      zone.startsWith("America/Belem") ||
      zone.startsWith("America/Maceio") ||
      zone.startsWith("America/Salvador") ||
      zone.startsWith("America/Porto_Velho") ||
      zone.startsWith("America/Manaus") ||
      zone.startsWith("America/Curiba") ||
      zone.startsWith("America/Porto_Alegre") ||
      zone.startsWith("America/Rio_Branco"),
  );

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
                <Label className="font-semibold">Nome Completo:</Label>

                <Input
                  {...form.register("name")}
                  placeholder="Digite seu nome completo"
                />

                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field>
                <Label className="font-semibold">Endereço Completo:</Label>

                <Input
                  {...form.register("address")}
                  placeholder="Digite o endereço da clinica"
                />

                {errors.address && (
                  <FieldError>{errors.address.message}</FieldError>
                )}
              </Field>

              <Field>
                <Label className="font-semibold">Telefone:</Label>

                <Input
                  {...form.register("phone")}
                  placeholder="Digite seu telefone"
                />

                {errors.phone && (
                  <FieldError>{errors.phone.message}</FieldError>
                )}
              </Field>

              <Field>
                <Label className="font-semibold">Status</Label>

                <Select
                  value={form.watch("status")}
                  onValueChange={(value: "ATIVO" | "INATIVO") =>
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
                    <SelectItem value="ATIVO">Clinica Aberta</SelectItem>
                    <SelectItem value="INATIVO">Clinica Fechada</SelectItem>
                  </SelectContent>
                </Select>

                {errors.status && (
                  <FieldError>{errors.status.message}</FieldError>
                )}
              </Field>

              <div className="space-y-2">
                <Label className="font-semibold">
                  Configurar horarios da clinica
                </Label>
                <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-muted-foreground"
                    >
                      Clique aqui para selecionar horarios
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Horarios da clinica
                      </DialogTitle>
                      <DialogDescription className="text-sm text-center">
                        Selecione abaixo os horarios de funcionamento da
                        clinica:
                      </DialogDescription>
                    </DialogHeader>

                    <section className="py-4">
                      <p className="text-sm text-muted-foreground mb-2 ">
                        Clique para selecionar um horario
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {slots.map((hour) => (
                          <Button
                            key={hour}
                            variant="outline"
                            className={cn(
                              "h-10",
                              selectdHours.includes(hour) &&
                                "border-2 border-emerald-500 text-primary",
                            )}
                            onClick={() => toggleHour(hour)}
                          >
                            {hour}
                          </Button>
                        ))}
                      </div>
                    </section>
                    <Button
                      className="w-full bg-emerald-600 text-white hover:bg-emerald-500"
                      onClick={() => setDialogIsOpen(false)}
                    >
                      Confirmar
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>

              <Field>
                <FieldLabel className="font-semibold">
                  Selecione o fuso horário
                </FieldLabel>

                <Select
                  value={form.getValues("timeZone")}
                  onValueChange={(value) =>
                    form.setValue("timeZone", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu fuso horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.timeZone && (
                  <FieldError>{errors.timeZone.message}</FieldError>
                )}
              </Field>
              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white"
              >
                Salvar Alterações
              </Button>
            </FieldGroup>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
