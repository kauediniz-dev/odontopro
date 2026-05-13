"use server";
import prisma from "@/app/lib/prisma";

export async function getInfoSchedule({ userId }: { userId: string }) {
  try {
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        subscription: true,
        services: {
          where: {
            status: "ATIVO",
          },
        },
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
