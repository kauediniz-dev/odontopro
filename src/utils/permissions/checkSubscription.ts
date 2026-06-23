"use server";

import prisma from "@/lib/prisma";
import { addDays, isAfter, differenceInDays } from "date-fns";
import { Trial_Days } from "./trial-limits";

export async function checkSubscription(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      subscription: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado!");
  }

  if (user.subscription && user.subscription.status === "ATIVO") {
    return {
      subscriptionStatus: "ACTIVE",
      message: "Assinatura ativa",
      planId: user.subscription.plano,
    };
  }

  const trialEndDate = addDays(user.createdAt, Trial_Days);

  if (isAfter(new Date(), trialEndDate)) {
    return {
      subscriptionStatus: "EXPIRED",
      message:
        "Plano gratuito expirado, por favor, adquira um plano ou entre em contato com o suporte para obter ajuda.",
      planId: "TRIAL",
    };
  }

  const daysRemaining = differenceInDays(trialEndDate, new Date());

  return {
    subscriptionStatus: "TRIAL",
    message: `Você esta no periodo de teste gratuito. Faltam ${daysRemaining} dias para o plano gratuito expirar.`,
    planId: "TRIAL",
  };
}
