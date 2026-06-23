"use server";

import { addDays, isAfter } from "date-fns";
import { Session } from "next-auth";
import { ResultPermissionProp } from "./canPermission";
import { Trial_Days } from "./trial-limits";

export async function checkSubscriptionExpired(
  session: Session,
): Promise<ResultPermissionProp> {
  const trialEndDate = addDays(session?.user?.created_At!, Trial_Days);

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
