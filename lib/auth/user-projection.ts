import { normalizeEmail } from "../membership/policy";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  playerId: string | null;
  role: "player" | "admin" | null;
};

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | string[] | null;
};

type PlayerLink = {
  _id: { toString(): string };
  name?: string | null;
};

function normalizeRole(role: SessionUser["role"]): CurrentUser["role"] {
  const values = Array.isArray(role) ? role : role?.split(",") ?? [];
  if (values.includes("admin")) {
    return "admin";
  }
  if (values.includes("player") || values.includes("user")) {
    return "player";
  }
  return null;
}

export function projectCurrentUser(
  user: SessionUser,
  player: PlayerLink | null
): CurrentUser {
  return {
    id: user.id,
    email: normalizeEmail(user.email),
    name: user.name?.trim() || normalizeEmail(user.email),
    role: normalizeRole(user.role),
    playerId: player ? player._id.toString() : null,
  };
}

export function evaluateMemberAccess(
  user: CurrentUser,
  isPaid: boolean
):
  | { allowed: false; reason: "not_paid" }
  | { allowed: true; access: "paid" | "admin-bypass" } {
  if (user.role === "admin") {
    return { allowed: true, access: "admin-bypass" };
  }
  if (isPaid) {
    return { allowed: true, access: "paid" };
  }
  return { allowed: false, reason: "not_paid" };
}
