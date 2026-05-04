"use client";
import { useState } from "react";
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
export function ProfileContent() {
  const form = useProfileForm();

  const [selectdHours, setSelectedHours] = useState<string[]>([]);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  function onSubmit(data: any) {
    console.log(data);
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

              <div className="space-y-2">
                <Label className="font-semibold">
                  Configurar horarios da clinica
                </Label>
                <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
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
            </FieldGroup>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
