"use server";

import { signIn } from "@/app/lib/auth";

export async function handleRegister(provider: string) {
  await signIn(provider, { redirectTo: "/dashboard" });
}
