import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "./config";

// Narrow the Auth.js session to the fields the app needs for access decisions.
export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  playerId: string | null;
  role: "player" | "admin" | null;
};

// React cache deduplicates session reads during a single server render.
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

// Require an authenticated session that also maps to a player record.
export async function requireUser(): Promise<CurrentUser> {
  // Mark auth as request-time work under Next 16 Cache Components.
  await connection();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  if (!user.playerId) {
    // An unknown email is an onboarding state, not an authentication error.
    redirect("/auth/not-listed");
  }
  return user;
}

// Apply the stricter role check only after the ordinary player check succeeds.
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/auth/forbidden");
  }
  return user;
}