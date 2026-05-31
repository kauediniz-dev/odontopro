import { getReminders } from "../_data-access/get-reminders";

export async function Reminders({ userId }: { userId: string }) {
  const reminders = await getReminders({ userId: userId });
  console.log(reminders);
  return <h1>Reminders</h1>;
}
