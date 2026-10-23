import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { getPlayerByEmail } from "@/lib/db";
import { isPaidMember } from "@/lib/membership";
import { auth } from "./config";
import {
  evaluateMemberAccess,
  projectCurrentUser,
  type CurrentUser,
} from "./user-projection";

export type { CurrentUser } from "./user-projection";

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return null;
  }

  const player = await getPlayerByEmail(session.user.email);
  const user = projectCurrentUser(session.user, player);
  const access = evaluateMemberAccess(user, await isPaidMember(user.email));
  return access.allowed ? user : null;
});

async function requireAccessUser(): Promise<CurrentUser> {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await requireAccessUser();
  if (!user.playerId) {
    redirect("/auth/not-listed");
  }
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireAccessUser();
  if (user.role !== "admin") {
    redirect("/auth/forbidden");
  }
  return user;
}
