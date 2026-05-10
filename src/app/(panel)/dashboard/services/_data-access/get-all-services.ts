"use server";

import prisma from "@/app/lib/prisma";

export async function getAllServices({ userId }: { userId: string }) {
  if (!userId) {
    return {
      error: "Falha ao buscar serviços",
    };
  }

  try {
    const services = await prisma.service.findMany({
      where: {
        userId: userId,
        status: "ATIVO",
      },
    });
    return {
      data: services,
    };
  } catch (err) {
    error: "Falha ao buscar serviços";
  }
}
