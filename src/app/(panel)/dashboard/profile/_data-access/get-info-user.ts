"use server";

import prisma from "@/app/lib/prisma";

interface GetUserDataProps {
  userId: string;
}

export async function getUserData({ userId }: GetUserDataProps) {
  try {
    if (!userId) {
      return null;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        subscription: true,
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
