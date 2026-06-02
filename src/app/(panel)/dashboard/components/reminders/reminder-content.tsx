"use client";

import { useEffect, useState } from "react";
import { useReminderForm, ReminderFormData } from "./reminder-form";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReminder } from "../../_actions/create-reminder";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReminderContentProps {
  closeDialog: () => void;
}

export function ReminderContent({ closeDialog }: ReminderContentProps) {
  const [isMounted, setIsMounted] = useState(false);

  const form = useReminderForm();
  const router = useRouter();

  const descriptionValue = form.watch("description");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Isso evita o erro de Hydration
  if (!isMounted) {
    return (
      <div className="py-4 text-sm text-gray-400">Carregando formulário...</div>
    );
  }

  async function onSubmit(formData: ReminderFormData) {
    const response = await createReminder({
      description: formData.description,
    });

    if (response.error) {
      toast.error(response.error);
      return;
    }
    toast.success(response.data);
    router.refresh();
    closeDialog();
  }
  return (
    <div className="grid gap-4 py-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Field>
            <FieldLabel className="font-semibold">
              Descrição do lembrete
            </FieldLabel>

            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="O que você deseja lembrar?"
                  className="max-h-52 resize-none"
                />
              )}
            />

            {form.formState.errors.description && (
              <FieldError>
                {form.formState.errors.description.message as string}
              </FieldError>
            )}

            <Button
              disabled={
                !descriptionValue || descriptionValue.trim().length === 0
              }
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 mt-2"
            >
              Cadastrar Lembrete
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
