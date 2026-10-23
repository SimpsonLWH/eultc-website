import "server-only";

import { ObjectId } from "mongodb";

import { PlayerModel } from "@/lib/db/models/player";
import { PasswordResetLinkModel } from "@/lib/db/models/password-reset-link";
import { listPaidMembers } from "@/lib/membership";
import { normalizeEmail } from "@/lib/membership/policy";
import {
  auth,
  authBaseURL,
  authDatabase,
  authSecret,
  INTERNAL_RESET_HEADER,
  RESET_ADMIN_HEADER,
} from "./config";
import { normalizeClubRole } from "./user-projection";

type AuthUserDocument = {
  _id: ObjectId;
  name?: string;
  email?: string;
  role?: string | string[] | null;
  createdAt?: Date;
};

export type MemberAccount = {
  id: string;
  name: string;
  email: string;
  role: "player" | "admin" | null;
  isPaid: boolean;
  hasPlayer: boolean;
  createdAt: string | null;
};

function mapAccount(
  user: AuthUserDocument,
  paidEmails: Set<string>,
  playerEmails: Set<string>
): MemberAccount {
  const email = normalizeEmail(user.email ?? "");
  return {
    id: user._id.toString(),
    name: user.name?.trim() || email,
    email,
    role: normalizeClubRole(user.role),
    isPaid: paidEmails.has(email),
    hasPlayer: playerEmails.has(email),
    createdAt: user.createdAt?.toISOString() ?? null,
  };
}

export async function listMemberAccounts(): Promise<MemberAccount[]> {
  const [users, paid, players] = await Promise.all([
    authDatabase
      .collection<AuthUserDocument>("user")
      .find({})
      .sort({ createdAt: 1 })
      .toArray(),
    listPaidMembers(),
    PlayerModel.find({}, { email: 1 }).lean(),
  ]);
  const paidEmails = new Set(paid.map((entry) => normalizeEmail(entry.email)));
  const playerEmails = new Set(
    players.map((player) => normalizeEmail(player.email))
  );

  return users.map((user) => mapAccount(user, paidEmails, playerEmails));
}

export async function findAuthUserByEmail(
  email: string
): Promise<MemberAccount | null> {
  const normalized = normalizeEmail(email);
  const [user, paid, player] = await Promise.all([
    authDatabase
      .collection<AuthUserDocument>("user")
      .findOne({ email: normalized }),
    listPaidMembers(),
    PlayerModel.exists({ email: normalized }),
  ]);
  if (!user) {
    return null;
  }

  return mapAccount(
    user,
    new Set(paid.map((entry) => normalizeEmail(entry.email))),
    new Set(player ? [normalized] : [])
  );
}

export async function findAuthUserById(
  userId: string
): Promise<MemberAccount | null> {
  if (!ObjectId.isValid(userId)) {
    return null;
  }
  const user = await authDatabase
    .collection<AuthUserDocument>("user")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) {
    return null;
  }

  const [paid, player] = await Promise.all([
    listPaidMembers(),
    PlayerModel.exists({ email: normalizeEmail(user.email ?? "") }),
  ]);
  return mapAccount(
    user,
    new Set(paid.map((entry) => normalizeEmail(entry.email))),
    new Set(player ? [normalizeEmail(user.email ?? "")] : [])
  );
}

export async function revokeAuthUserSessions(
  userId: string,
  requestHeaders: Headers
) {
  await auth.api.revokeUserSessions({
    body: { userId },
    headers: requestHeaders,
  });
}

export async function generatePasswordResetLink(
  userId: string,
  adminId: string,
  requestHeaders: Headers
): Promise<{ email: string; url: string } | null> {
  const user = await findAuthUserById(userId);
  if (!user) {
    return null;
  }

  await Promise.all([
    PasswordResetLinkModel.deleteOne({ userId }),
    authDatabase.collection("verification").deleteMany({
      identifier: { $regex: "^reset-password:" },
      value: userId,
    }),
  ]);

  const resetHeaders = new Headers(requestHeaders);
  resetHeaders.set(INTERNAL_RESET_HEADER, authSecret);
  resetHeaders.set(RESET_ADMIN_HEADER, adminId);
  await auth.api.requestPasswordReset({
    body: {
      email: user.email,
      redirectTo: new URL("/reset-password", authBaseURL).toString(),
    },
    headers: resetHeaders,
  });

  const link = await PasswordResetLinkModel.findOneAndDelete({
    userId,
    createdBy: adminId,
  }).lean();
  return link ? { email: user.email, url: link.url } : null;
}
