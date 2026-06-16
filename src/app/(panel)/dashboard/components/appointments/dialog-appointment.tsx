import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import App from "next/app";
import { AppointmentWithService } from "./appointments-list";
import { format } from "date-fns";
import formatCurrency from "@/utils/formatCurrency";

interface DialogAppointmentProps {
  appointment: AppointmentWithService | null;
}

export function DialogAppointment({ appointment }: DialogAppointmentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Detalhes do agendamento</DialogTitle>
        <DialogDescription>
          Veja todos os detalhes do agendamento
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        {appointment && (
          <article className="">
            <p className="">
              <span className="font-semibold">Nome:</span> {appointment.name}
            </p>
            <p>
              <span className="font-semibold">Telefone:</span>{" "}
              {appointment.phone}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {appointment.email}
            </p>
            <p>
              <span className="font-semibold">Data do agendamento:</span>{" "}
              {format(appointment.appointmentDate, "dd/MM/yyyy")}
            </p>
            <p>
              <span className="font-semibold">Horario de atendimento:</span>{" "}
              {appointment.time}
            </p>

            <section className="bg-gray-100 mt-4 p-2 roudend-md">
              <p>
                <span className="font-semibold">Servico:</span>{" "}
                {(appointment.service as any).name}{" "}
              </p>
              <p>
                <span className="font-semibold">Valor do serviço:</span>{" "}
                {formatCurrency(appointment.service.price / 100)}
              </p>
            </section>
          </article>
        )}
      </div>
    </DialogContent>
  );
}
