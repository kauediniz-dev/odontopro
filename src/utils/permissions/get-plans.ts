"use server";

import { Plan } from "@prisma/client";
import { PlanProps } from "../plans";

export interface PlanDetailInfo {
  maxServices: number;
}

const PLANS_LIMITS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PRO: {
    maxServices: 50,
  },
};

export async function getPlans(planId: Plan) {
  return PLANS_LIMITS[planId];
}
