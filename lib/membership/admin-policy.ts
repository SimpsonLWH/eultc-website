import type { ClubRole } from "./policy";

export function buildRegistrationUrl(baseUrl: string, code: string): string {
  const url = new URL("/sign-up", baseUrl);
  url.searchParams.set("invite", code);
  return url.toString();
}

export function evaluateMembershipRemoval(input: {
  targetRole: ClubRole | null;
  targetUserId: string | null;
}):
  | { allowed: false; reason: "admin_account" }
  | { allowed: true; revokeUserId: string | null } {
  if (input.targetRole === "admin") {
    return { allowed: false, reason: "admin_account" };
  }
  return { allowed: true, revokeUserId: input.targetUserId };
}
