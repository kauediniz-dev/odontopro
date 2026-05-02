import getSession from "@/app/lib/getSession";
import { redirect } from "next/navigation";
import { getUserData } from "./_data-access/get-info-user";
import { ProfileContent } from "./_components/profile";

export default async function Profile() {
  const session = await getSession();

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }

  const user = await getUserData({ userId: session.user.id });

  if (!user) {
    redirect("/"); // Redirect to home page if user data is not found
  }
  return <ProfileContent />;
}
