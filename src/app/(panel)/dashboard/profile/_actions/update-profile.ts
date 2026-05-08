"use server";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { z } from "zod";
import { tr } from "zod/v4/locales";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .min(2, "Nome muito curto"),

  address: z.string().default(""),
  phone: z.string().default(""),

  status: z.boolean(),

  timeZone: z.string(),

  times: z.array(z.string()),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateProfile(formData: FormSchema) {
  const session = await auth();

  if (!session) {
    throw new Error("Usuário não autenticado");
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    throw new Error("Dados inválidos");
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        status: formData.status ? "ATIVO" : "INATIVO",
        timeZone: formData.timeZone,
        times: formData.times || [],
      },
    });
    return { message: "Perfil atualizado com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    throw new Error("Erro ao atualizar perfil");
  }
}
