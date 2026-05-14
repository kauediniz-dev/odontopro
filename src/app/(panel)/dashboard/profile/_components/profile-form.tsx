"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UseProfileFormProps {
  // aqui você pode adicionar quaisquer props que queira passar para o hook, como dados iniciais do perfil, etc.
  name: string | null;
  address: string | null;
  phone: string | null;
  status: "ATIVO" | "INATIVO";
  timeZone: string | null;
}

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .min(2, "Nome muito curto"),

  address: z.string().default(""),
  phone: z.string().default(""),

  status: z.enum(["ATIVO", "INATIVO"]).default("ATIVO"),

  timeZone: z.string().min(1, "Selecione um fuso horário"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function useProfileForm({
  name,
  address,
  phone,
  status,
  timeZone,
}: UseProfileFormProps) {
  return useForm<ProfileFormData>({
    // aqui você pode configurar o hook useForm, como validação, valores iniciais, etc.
    resolver: zodResolver(profileSchema) as any,
    mode: "onChange",
    defaultValues: {
      // aqui vocé pode definir os valores iniciais do formulário
      name: name || "",
      address: address || "",
      phone: phone || "",
      status: status || "ATIVO",
      timeZone: timeZone || "",
    },
  });
}
