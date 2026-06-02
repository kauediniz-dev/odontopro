import { getTimesClinics } from "../../_data-access/get-times-clinics";
import { AppointmentsList } from "./appointments-list";

export async function Appointments({ userId }: { userId: string }) {
  const { times } = await getTimesClinics({ userId: userId });

  return <AppointmentsList times={times} />;
}
