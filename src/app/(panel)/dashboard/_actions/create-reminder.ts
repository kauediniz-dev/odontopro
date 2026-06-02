"use server";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  description: z.string().min(1, "A descrição é obrigatória"),
});

type FormSchema = z.infer<typeof formSchema>; // Define o tipo para os dados do formulário

export async function createReminder(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Usuário não autenticado." };
  }
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    await prisma.reminder.create({
      data: {
        description: formData.description,
        userId: session?.user?.id,
        title: "Lembrete", // Ou use os primeiros caracteres da descrição
        date: new Date(), // Define a data de criação como padrão
      },
    });

    revalidatePath("/dashboard/reminders");

    return { data: "Lembrete criado com sucesso!" };
  } catch (err) {
    return { error: "Erro ao criar lembrete." };
  }
}
