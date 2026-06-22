"use server";

import { addDays, isAfter } from "date-fns";
import { Session } from "next-auth";
import { ResultPermissionProp } from "./canPermission";

const TRAIL_DAYS = 3;

export async function checkSubscriptionExpired(
  session: Session,
): Promise<ResultPermissionProp> {
  const trialEndDate = addDays(session?.user?.created_At!, TRAIL_DAYS);

  if (isAfter(new Date(), trialEndDate)) {
    return {
      hasPermission: false,
      planId: "EXPIRED",
      expired: false,
      plan: null,
    };
  }

  return {
    hasPermission: true,
    planId: "TRIAL",
    expired: false,
    plan: null,
  };
}
