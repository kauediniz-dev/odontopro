"use server";

import prisma from "@/app/lib/prisma";

export async function getProfessionals() {
  try {
    const professionals = await prisma.user.findMany({
      where: {
        status: "ATIVO",
      },
    });

    return professionals;
  } catch (err) {
    return [];
  }
}
