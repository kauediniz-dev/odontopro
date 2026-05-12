"use server";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  serviceId: z.string().min(1, "O id é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  price: z.number().min(1, "O preço é obrigatório"),
  duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Falha ao atualizar serviço" };
  }
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    await prisma.service.update({
      where: { id: formData.serviceId, userId: session?.user?.id },
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration <= 30 ? 30 : formData.duration,
      },
    });

    revalidatePath("/dashboard/services");

    return { data: "Serviço atualizado com sucesso!" };
  } catch (err) {
    return { error: "Falha ao atualizar serviço" };
  }
}
