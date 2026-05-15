import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Buscar se tem agendamentos (appointments) em uma data
  // especifica de uma cliente
  const { searchParams } = req.nextUrl;

  const userId = searchParams.get("userId");
  const dateParam = searchParams.get("date");

  if (!userId || userId === "null" || !dateParam || dateParam === "null") {
    return NextResponse.json(
      { error: "Nenhum agendamento encontrado" },
      { status: 400 },
    );
  }

  try {
    // Converte a data recebida em um objeto Date
    const [year, month, day] = dateParam.split("-").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Nenhum agendamento encontrado" },
      { status: 400 },
    );
  }
}
