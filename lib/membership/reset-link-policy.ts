import { normalizeEmail } from "./policy";

export type ResetLinkRecord = {
  userId: string;
  email: string;
  url: string;
  createdBy: string;
  expiresAt: Date;
  usedAt: Date | null;
};

export function createPendingResetLink(input: {
  userId: string;
  email: string;
  createdBy: string;
  now?: Date;
}): ResetLinkRecord {
  const now = input.now ?? new Date();
  return {
    userId: input.userId,
    email: normalizeEmail(input.email),
    url: "",
    createdBy: input.createdBy,
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    usedAt: null,
  };
}

export function applyGeneratedResetUrl(
  pending: ResetLinkRecord,
  url: string
): ResetLinkRecord {
  return { ...pending, url };
}
