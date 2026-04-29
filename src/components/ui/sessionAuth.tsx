"use client";
import { SessionProvider } from "next-auth/react";

export function SessionAuth({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
