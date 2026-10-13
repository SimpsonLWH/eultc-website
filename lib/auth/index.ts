import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "./config";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  playerId: string | null;
  role: "player" | "admin" | null;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  if (!session?.user?.email || !session.user.id) {
    return null;
  }

  const email = session.user.email.trim().toLowerCase();

  return {
    id: session.user.id,
    email,
    name: session.user.name ?? email,
    playerId: session.user.playerId,
    role: session.user.role,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.playerId) {
    redirect("/auth/not-listed");
  }
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/auth/forbidden");
  }
  return user;
}