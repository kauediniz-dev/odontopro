"use server";

import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const formSchema = z.object({
  serviceId: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteService(formData: FormSchema) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Falha ao deletar serviço" };
  }

  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    await prisma.service.update({
      where: { id: formData.serviceId, userId: session?.user?.id },
      data: {
        status: "INATIVO",
      },
    });

    revalidatePath("/dashboard/services");

    return { data: "Serviço deletado com sucesso!" };
  } catch (err) {
    return { error: "Falha ao deletar serviço" };
  }
}
