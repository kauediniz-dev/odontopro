import { Status } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: null | string | boolean;
  image?: string;
  stripe_customer_id?: string;
  times: string[];
  adress?: string;
  phone?: string;
  status: Status;
  created_At: string;
  updated_At: string;
}
