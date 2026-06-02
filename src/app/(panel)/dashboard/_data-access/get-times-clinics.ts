"use server";

import prisma from "@/app/lib/prisma";

export async function getTimesClinics({ userId }: { userId: string }) {
  if (!userId) {
    return {
      times: [],
      userId: "",
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        times: true,
      },
    });
    if (!user) {
      return {
        times: [],
        userId: "",
      };
    }

    return {
      times: user.times,
      userId: user.id,
    };
  } catch (err) {
    console.error("Error fetching times clinics:", err);
    return {
      times: [],
      userId: "",
    };
  }
}
