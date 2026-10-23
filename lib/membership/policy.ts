const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ClubRole = "player" | "admin";

export type RegistrationAccess =
  | { allowed: false; reason: "invalid_invite" | "not_paid" | "invalid_email" }
  | {
      allowed: true;
      email: string;
      role: ClubRole;
      access: "paid" | "admin-bypass";
    };

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function parseMembershipEmails(input: string): {
  emails: string[];
  invalid: string[];
} {
  const emails = new Set<string>();
  const invalid: string[] = [];

  for (const line of input.split(/\r?\n/)) {
    const email = normalizeEmail(line);
    if (!email) {
      continue;
    }
    if (emailPattern.test(email)) {
      emails.add(email);
    } else {
      invalid.push(email);
    }
  }

  return { emails: [...emails], invalid };
}

export function evaluateRegistrationAccess(input: {
  email: string;
  inviteCode: string;
  activeInviteCode: string | null;
  isPaid: boolean;
  isAdmin: boolean;
}): RegistrationAccess {
  if (
    !input.activeInviteCode ||
    input.inviteCode.trim() !== input.activeInviteCode
  ) {
    return { allowed: false, reason: "invalid_invite" };
  }

  const email = normalizeEmail(input.email);
  if (!emailPattern.test(email)) {
    return { allowed: false, reason: "invalid_email" };
  }
  if (input.isAdmin) {
    return {
      allowed: true,
      email,
      role: "admin",
      access: "admin-bypass",
    };
  }
  if (!input.isPaid) {
    return { allowed: false, reason: "not_paid" };
  }

  return { allowed: true, email, role: "player", access: "paid" };
}

export function getPasswordProblem(
  password: string,
  confirmation: string
): string | null {
  if (password.length < 12) {
    return "Password must be at least 12 characters.";
  }
  if (password.length > 128) {
    return "Password must be 128 characters or fewer.";
  }
  if (password !== confirmation) {
    return "Passwords do not match.";
  }
  return null;
}

export function getResetLinkState(
  link: { expiresAt: Date; usedAt?: Date | null },
  now = new Date()
): "active" | "expired" | "used" {
  if (link.usedAt) {
    return "used";
  }
  return link.expiresAt.getTime() <= now.getTime() ? "expired" : "active";
}
