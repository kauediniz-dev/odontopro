"use server";
import { Subscription } from "lib/generated";
import { Session } from "next-auth";
import { getPlans } from "./get-plans";
import prisma from "@/lib/prisma";
import { PLANS } from "../plans";
import { checkSubscriptionExpired } from "./checkSubscriptionExpired";
import { ResultPermissionProp } from "./canPermission";

export async function canCreateService(
  subscription: Subscription | null,
  session: Session,
): Promise<ResultPermissionProp> {
  try {
    const serviceCount = await prisma.service.count({
      where: {
        userId: session?.user?.id,
      },
    });

    if (subscription?.status === "ATIVO") {
      const plan = subscription.plano;
      const planLimits = await getPlans(plan);

      console.log("LIMITES DO SEU PLANO: ", planLimits);

      return {
        hasPermission:
          planLimits.maxServices === null ||
          serviceCount < planLimits.maxServices, // verifica se a quantidade de services do plano e menor que a quantidade de services do usuario
        planId: subscription.plano,
        expired: false,
        plan: PLANS[subscription.plano],
      };
    }

    //Periodo de teste
    const checkUserLimit = await checkSubscriptionExpired(session);

    return checkUserLimit;
  } catch (err) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: false,
      plan: null,
    };
  }
}
