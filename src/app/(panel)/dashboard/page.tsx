import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ButtonCopyLink } from "./components/button-copy-link";
import { Reminders } from "./components/reminders/reminders";
import { Appointments } from "./components/appointments/appointments";
import getSession from "@/lib/getSession";

export default async function Dashboard() {
  const session = await getSession(); // Placeholder for session management

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }

  return (
    <main className="">
      <div className="space-x-2 flex items-center justify-end">
        <Link href={`/clinica/${session.user?.id}/agenda`} target="_blank">
          <Button className="bg-emerald-500 hover:bg-emerald-400 flex-1 md:flex-[0]">
            <Calendar className="w-5 h-5" />
            <span>Novo Agendamento</span>
          </Button>
        </Link>
        <ButtonCopyLink userId={session.user?.id!} />
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 mt-4">
        <Appointments userId={session.user?.id!} />

        <Reminders userId={session.user?.id!} />
      </section>
    </main>
  );
}
