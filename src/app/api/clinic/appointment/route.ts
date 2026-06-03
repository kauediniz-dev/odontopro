import { auth } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Rota para buscar todos os agendamentos de uma clínica
// > Preciso ter a data
// > Preciso ter o id da clínica

export const GET = auth(async function GET(request) {
  if (!request) {
    return NextResponse.json(
      {
        error: "Acesso negado!",
      },
      {
        status: 401,
      },
    );
  }
  const searchParams = request.nextUrl.searchParams;
  const dateString = searchParams.get("date") as string;
  const clinicId = request.auth?.user?.id;

  if (!dateString) {
    return NextResponse.json({ error: "Data não informada!" }, { status: 400 });
  }

  if (!clinicId) {
    return NextResponse.json(
      { error: "Clinica não encontrada!" },
      { status: 400 },
    );
  }
  try {
    // Criar uma data formatada
    const [year, month, day] = dateString.split("-").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: clinicId,
        appointmentDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao encontrar agendamento!" },
      { status: 400 },
    );
  }
});
