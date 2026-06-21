import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GridPlans } from "./_components/grid-plans";
import { getSubscriptions } from "@/utils/get-subscriptions";
import { Subscript } from "lucide-react";
import { SubscriptionDetails } from "./_components/subscription-details";

export default async function Plans() {
  const session = await getSession(); // Placeholder for session management

  if (!session) {
    redirect("/"); // Redirect to home page if not authenticated
  }

  const subscription = await getSubscriptions({ userId: session?.user?.id! });

  return (
    <div>
      {subscription?.status !== "ATIVO" && <GridPlans />}
      {subscription?.status === "ATIVO" && (
        <SubscriptionDetails subscription={subscription!} />
      )}
    </div>
  );
}
