"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  appointmentId: z.string().min(1, "Necessario fornecer um agendamento"),
});

type FormSchema = z.infer<typeof formSchema>; // Define o tipo para os dados do formulário

export async function cancelAppointment(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Usuário não autenticado." };
  }

  try {
    await prisma.appointment.delete({
      where: {
        id: formData.appointmentId,
        userId: session?.user?.id,
      },
    });

    revalidatePath("/dashboard");

    return { data: "Agendamento cancelado com sucesso!" };
  } catch (err) {
    return { error: "Erro ao cancelar agendamento." };
  }
}
