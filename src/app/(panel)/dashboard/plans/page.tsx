import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GridPlans } from "./_components/grid-plans";

export default async function Plans() {
  const session = await getSession(); // Placeholder for session management

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }

  return (
    <div>
      <GridPlans />
    </div>
  );
}
