"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod"; // Importa o zod para validação de esquema

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  price: z.string().min(1, "O preco é obrigatório"),
  hours: z.string(),
  minutes: z.string(),
});

export interface UseDialogServiceFormProps {
  initialValues?: {
    name: string;
    price: string;
    hours: string;
    minutes: string;
  };
}

export type DialogServiceFormData = z.infer<typeof formSchema>; // Define o tipo dos valores do formulário com base no esquema do zod

export function useDialogServiceForm({
  initialValues,
}: UseDialogServiceFormProps) {
  // Cria um hook personalizado para o formulário do diálogo de serviço
  return useForm<DialogServiceFormData>({
    resolver: zodResolver(formSchema), // Usa o zodResolver para validação do formulário
    defaultValues: initialValues || {
      name: "",
      price: "",
      hours: "",
      minutes: "",
    },
  });
}
