"use server";

import { auth } from "@/lib/auth";
import { PlanDetailInfo } from "./get-plans";
import prisma from "@/lib/prisma";
import { canCreateService } from "./canCreateService";

// Pergunta se o usuário tem permissão

export type PLAN_PROP = "BASIC" | "PRO" | "EXPIRED" | "TRIAL";
type TypeCheck = "service";

export interface ResultPermissionProp {
  hasPermission: boolean;
  planId: PLAN_PROP;
  expired: boolean;
  plan: PlanDetailInfo | null;
}

interface CanPermissionProps {
  type: TypeCheck;
}

export async function canPermission({
  type,
}: CanPermissionProps): Promise<ResultPermissionProp> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: true,
      plan: null,
    };
  }

  const subscriptions = await prisma.subscription.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });

  switch (type) {
    case "service":
      // verificar se esse user pode criar quantos serviços com o plano dele

      const permission = await canCreateService(subscriptions, session);

      return permission;

    default:
      return {
        hasPermission: false,
        planId: "EXPIRED",
        expired: true,
        plan: null,
      };
  }
}
