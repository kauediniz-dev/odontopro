"use client";
import { useState } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDialogServiceForm,
  DialogServiceFormData,
} from "./dialog-service-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { convertRealToCents } from "@/utils/convert-currency";
import { createNewService } from "../_actions/create-service";
import { toast } from "sonner";

interface DialogServiceProps {
  closeModal: () => void;
}

export function DialogService({ closeModal }: DialogServiceProps) {
  const form = useDialogServiceForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: DialogServiceFormData) {
    setLoading(true);
    const priceInCents = convertRealToCents(values.price);
    const hours = parseInt(values.hours) || 0;
    const minutes = parseInt(values.minutes) || 0;
    const duration = hours * 60 + minutes;
    const response = await createNewService({
      // Chama a função para criar um novo serviço
      name: values.name,
      price: priceInCents,
      duration: duration,
    });

    setLoading(false);

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success("Serviço criado com sucesso!");
    handleCloseModal();
  }

  function handleCloseModal() {
    form.reset(); // Limpa o formulário ao fechar o diálogo
    closeModal(); // Fecha o diálogo
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>) {
    let { value } = event.target;
    value = value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (value) {
      value = (parseInt(value, 10) / 100).toFixed(2); // Converte para formato de moeda
      value = value.replace(".", ","); // Substitui ponto por vírgula
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona pontos como separadores de milhar
    }

    event.target.value = value;
    form.setValue("price", value); // Atualiza o valor do campo "price" no formulário
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-center font-semibold">
          Adicionar Serviço
        </DialogTitle>

        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo serviço.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-3">
          <div className="flex flex-col gap-3">
            <Field className="my-2">
              <FieldLabel className="font-semibold">
                Nome do serviço:
              </FieldLabel>
              <Input
                {...form.register("name")}
                placeholder="Ex: Limpeza dentária"
              />

              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <Field className="">
              <FieldLabel className="font-semibold">
                Valor do serviço:
              </FieldLabel>
              <Input
                {...form.register("price")}
                placeholder="Ex: 100.00"
                onChange={changeCurrency}
              />

              {form.formState.errors.price && (
                <FieldError>{form.formState.errors.price.message}</FieldError>
              )}
            </Field>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-center">
              Tempo estimado de serviço
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Field className="my-2">
                <FieldLabel className="font-semibold">Horas:</FieldLabel>
                <Input
                  {...form.register("hours")}
                  placeholder="Ex: 12:00"
                  min="0"
                  type="number"
                />

                {form.formState.errors.hours && (
                  <FieldError>{form.formState.errors.hours.message}</FieldError>
                )}
              </Field>

              <Field className="my-2">
                <FieldLabel className="font-semibold">Minutos:</FieldLabel>
                <Input
                  {...form.register("minutes")}
                  placeholder="Ex: 00:30"
                  min="0"
                  type="number"
                />

                {form.formState.errors.minutes && (
                  <FieldError>
                    {form.formState.errors.minutes.message}
                  </FieldError>
                )}
              </Field>
            </div>
          </div>
        </FieldGroup>
        <Button
          type="submit"
          className="w-full font-semibold text-white bg-emerald-500 hover:bg-emerald-600"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Adicionar"}
        </Button>
      </form>
    </>
  );
}
