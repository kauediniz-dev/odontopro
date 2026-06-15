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
    // 1. Criar as datas usando Date.UTC para garantir que estamos no fuso 0
    const [year, month, day] = dateString.split("-").map(Number);

    // Use Date.UTC para evitar que o fuso horário local interfira
    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    console.log(
      "Buscando entre:",
      startDate.toISOString(),
      "e",
      endDate.toISOString(),
    );

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
