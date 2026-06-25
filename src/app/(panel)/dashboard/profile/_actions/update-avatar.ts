"use server";

import { revalidate } from "@/app/(public)/page";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAvatar({ avatarUrl }: { avatarUrl: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Usuário não autenticado.",
    };
  }

  if (!avatarUrl) {
    error: "Imagem inválida";
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: avatarUrl,
      },
    });

    revalidatePath("/dashboard/profile");
    return {
      data: "Imagem atualizada com sucesso!",
    };
  } catch (err) {
    return {
      error: "Erro ao atualizar Imagem.",
    };
  }
}
