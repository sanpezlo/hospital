import { type Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role;
      passwordChanged: Date | null;
      specialization: string | null;
      centerId: string | null;
      hashedPassword: string;
    } & DefaultSession["user"];
  }
}
