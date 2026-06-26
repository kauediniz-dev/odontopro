"use client";

import { Button } from "@/components/ui/button";
import { createSubscription } from "../_actions/create-subscription";
import { toast } from "sonner";
import { useState } from "react";
import { Plan } from "@prisma/client";

interface SubscriptionButtonProps {
  type: Plan;
}

export function SubscriptionButton({ type }: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateBilling() {
    try {
      setIsLoading(true);

      // ✅ Criar assinatura
      const { sessionId, error, url } = await createSubscription({
        type: type,
      });

      // ✅ Validar erro
      if (error) {
        toast.error(error || "Ocorreu um erro ao criar a assinatura.");
        return;
      }

      // ✅ Validar URL e sessionId
      if (!url || !sessionId) {
        toast.error("Falha ao gerar sessão de pagamento.");
        return;
      }

      // ✅ Redirecionar para Stripe
      window.location.href = url;
    } catch (err) {
      console.error("[handleCreateBilling] Error:", err);
      toast.error("Erro ao processar assinatura. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      className={`w-full font-semibold transition-colors ${
        type === "PRO"
          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
          : "bg-black hover:bg-black/80 text-white"
      }`}
      onClick={handleCreateBilling}
      disabled={isLoading}
    >
      {isLoading ? "Processando..." : "Assinar Plano"}
    </Button>
  );
}
