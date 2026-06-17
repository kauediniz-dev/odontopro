"use server";

import prisma from "@/app/lib/prisma";
import z from "zod";

const formSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().min(1, "O email é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  date: z.date(),
  serviceId: z.string().min(1, "O serviço é obrigatório"),
  time: z.string().min(1, "O horário é obrigatório"),
  clinicId: z.string().min(1, "O horário é obrigatorio"),
});

type FormData = z.infer<typeof formSchema>;

export async function createNewAppointment(formdata: FormData) {
  const schema = formSchema.safeParse(formdata);

  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  const { name, email, phone, date, serviceId, time, clinicId } = schema.data;

  try {
    const selectedDate = new Date(formdata.date);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const appointmentDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        userId: clinicId,
        appointmentDate: appointmentDate,
        time: time,
      },
    });

    if (existingAppointment) {
      return {
        error: "Este horário acabou de ser preenchido por outra pessoa!",
      };
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        name: formdata.name,
        email: formdata.email,
        phone: formdata.phone,
        appointmentDate: appointmentDate,
        serviceId: formdata.serviceId,
        time: formdata.time,
        userId: formdata.clinicId,
      },
    });
    return { data: newAppointment };
  } catch (err) {
    console.error(err);
    return { error: "Erro ao criar agendamento" };
  }
}
