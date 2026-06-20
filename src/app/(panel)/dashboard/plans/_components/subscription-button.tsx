"use client";

import { Button } from "@/components/ui/button";
import { Plan } from "@prisma/client";
import { createSubscription } from "../_actions/create-subscription";
import { toast } from "sonner";
import { getStripeJs } from "@/utils/stripe-js";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  async function handleCreateBilling() {
    const { sessionId, error, url } = await createSubscription({ type: type });

    if (error) {
      toast.error("Ocorreu um erro ao criar a assinatura.");
    }

    const stripe = await getStripeJs();

    if (stripe && url) {
      window.location.href = url;
    }
  }

  return (
    <Button
      className={`w-full font-semibold bg-black hover:bg-black/80 ${type === "PRO" && "bg-emerald-500 hover:bg-emerald-400"}`}
      onClick={handleCreateBilling}
    >
      Assinar Plano
    </Button>
  );
}
