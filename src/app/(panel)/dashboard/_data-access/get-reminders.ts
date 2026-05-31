"use server";

import prisma from "@/app/lib/prisma";

export async function getReminders({ userId }: { userId: string }) {
  if (!userId) {
    return [];
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: userId,
      },
    });
    return reminders;
  } catch (err) {
    console.error("Error fetching reminders:", err);
    return [];
  }
}
