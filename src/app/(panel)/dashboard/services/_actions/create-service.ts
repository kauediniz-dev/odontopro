"use server";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  price: z.number().min(1, "O preço é obrigatório"),
  duration: z.number(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createNewService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Usuário não autenticado" };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    const newService = await prisma.service.create({
      data: {
        name: formData.name,
        price: formData.price,
        duration: formData.duration,
        userId: session?.user?.id,
      },
    });

    return { data: newService };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao criar serviço" };
  }
}
