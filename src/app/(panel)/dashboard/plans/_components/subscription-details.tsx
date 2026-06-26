"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { toast } from "sonner";
import { createPortalCustomer } from "../_actions/create-portal-customer";
import { Subscription } from "@prisma/client";

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export function SubscriptionDetails({
  subscription,
}: SubscriptionDetailsProps) {
  const subscriptionInfo = subscriptionPlans.find(
    (plan) => plan.id === subscription.plano,
  );

  async function handleManageSubscription() {
    const portal = await createPortalCustomer();

    if (!portal.sessionId) {
      toast.error("Ocorreu um erro ao gerenciar a assinatura.");
      return;
    }

    window.location.href = portal.sessionId;
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Detalhes da assinatura
        </CardTitle>
        <CardDescription>Sua assinatura esta ativa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <h1
            className={`font-semibold text-lg md:text-xl ${subscription.plano === "PRO" && "text-emerald-500"}`}
          >
            {subscription.plano}
          </h1>
          <div
            className={`font-semibold bg-black text-white w-fit px-4 py-1 rounded-md ${subscription.plano === "PRO" && "bg-emerald-500"}`}
          >
            {subscription.status === "ATIVO" ? "ATIVO" : "INATIVO"}
          </div>
        </div>

        <ul className="list-disc list-inside space-y-2">
          {subscriptionInfo &&
            subscriptionInfo.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManageSubscription}>Gerenciar assinatura</Button>
      </CardFooter>
    </Card>
  );
}
