import getSession from "@/app/lib/getSession";
import { redirect } from "next/navigation";
import { ServicesContent } from "./_components/service-content";

export default async function Services() {
  const session = await getSession();

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }
  return <ServicesContent userId={session.user.id!} />; // Pass userId as a prop to ServiceContent
}
