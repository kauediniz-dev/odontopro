"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSearchParams } from "next/navigation";

export const appointmentSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
});

export type AppoinmentFormData = z.infer<typeof appointmentSchema>;

export function useAppoinmentForm() {
  // 1. Captura os parâmetros da URL
  const searchParams = useSearchParams();
  const serviceIdFromUrl = searchParams.get("serviceId") || "";

  return useForm<AppoinmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: new Date(),
      serviceId: serviceIdFromUrl, // 2. Usa o valor da URL como padrão
    },
  });
}
