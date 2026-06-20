"use server";

import prisma from "@/lib/prisma";

export async function getSubscriptions({ userId }: { userId: string }) {
  if (!userId) {
    return null;
  }

  try {
    const subscriptions = await prisma.subscription.findFirst({
      where: {
        userId: userId,
      },
    });
    return subscriptions;
  } catch (err) {
    return null;
  }
}
