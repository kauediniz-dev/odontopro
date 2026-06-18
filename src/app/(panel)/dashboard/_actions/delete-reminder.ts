"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import z from "zod";

const formSchema = z.object({
  reminderId: z.string().min(1, "O ID do lembrete é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>; // Define the type for the form data

export async function deleteReminder(formData: FormSchema) {
  const schema = formSchema.safeParse(formData); // Validate the form data against the schema

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    await prisma.reminder.delete({
      // Delete the reminder from the database
      where: {
        id: schema.data.reminderId,
      },
    });

    revalidatePath("/dashboard/reminders"); // Revalidate the path to update the UI after deletion

    return { data: "Lembrete excluído com sucesso!" };
  } catch (err) {
    console.error("Error deleting reminder:", err);
    return { error: "Erro ao excluir lembrete." };
  }
}
