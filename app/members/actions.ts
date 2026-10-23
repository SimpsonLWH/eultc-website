"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  findAuthUserByEmail,
  generatePasswordResetLink,
  revokeAuthUserSessions,
} from "@/lib/auth/admin-data";
import { requireAdmin } from "@/lib/auth";
import {
  addPaidMembers,
  removePaidMember,
  rotateRegistrationInvite,
} from "@/lib/membership";
import { evaluateMembershipRemoval } from "@/lib/membership/admin-policy";
import {
  normalizeEmail,
  parseMembershipEmails,
} from "@/lib/membership/policy";

export type MembersActionState = {
  error?: string;
  message?: string;
  resetEmail?: string;
  resetUrl?: string;
} | null;

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function revalidateMemberViews() {
  revalidatePath("/members");
  revalidatePath("/");
}

export async function rotateInviteAction(
  _previousState: MembersActionState,
  _formData: FormData
): Promise<MembersActionState> {
  void _previousState;
  void _formData;
  const user = await requireAdmin();

  try {
    await rotateRegistrationInvite(user.id);
  } catch {
    return { error: "The registration link could not be rotated." };
  }

  revalidateMemberViews();
  return { message: "A new registration link is now active." };
}

export async function addPaidMembersAction(
  _previousState: MembersActionState,
  formData: FormData
): Promise<MembersActionState> {
  const user = await requireAdmin();
  const parsed = parseMembershipEmails(text(formData, "emails"));
  if (parsed.invalid.length > 0) {
    return {
      error: `Fix these invalid email addresses: ${parsed.invalid.join(", ")}`,
    };
  }
  if (parsed.emails.length === 0) {
    return { error: "Enter at least one email address." };
  }

  try {
    await addPaidMembers(parsed.emails, user.id);
  } catch {
    return { error: "The paid email list could not be updated." };
  }

  revalidateMemberViews();
  return {
    message: `${parsed.emails.length} paid email${
      parsed.emails.length === 1 ? "" : "s"
    } added.`,
  };
}

export async function removePaidMemberAction(
  _previousState: MembersActionState,
  formData: FormData
): Promise<MembersActionState> {
  await requireAdmin();
  const email = normalizeEmail(text(formData, "email"));
  const account = email ? await findAuthUserByEmail(email) : null;
  const removal = evaluateMembershipRemoval({
    targetRole: account?.role ?? null,
    targetUserId: account?.id ?? null,
  });
  if (!removal.allowed) {
    return { error: "Admin accounts bypass membership and cannot be removed here." };
  }

  try {
    await removePaidMember(email);
    if (removal.revokeUserId) {
      await revokeAuthUserSessions(removal.revokeUserId, await headers());
    }
  } catch {
    return { error: "The paid email could not be removed." };
  }

  revalidateMemberViews();
  return { message: `${email} removed from the paid list.` };
}

export async function generateResetLinkAction(
  _previousState: MembersActionState,
  formData: FormData
): Promise<MembersActionState> {
  const admin = await requireAdmin();
  const userId = text(formData, "userId").trim();
  if (!userId) {
    return { error: "Choose an account first." };
  }

  try {
    const link = await generatePasswordResetLink(
      userId,
      admin.id,
      await headers()
    );
    if (!link) {
      return { error: "A reset link could not be generated for that account." };
    }
    return {
      message: "Reset link generated. It will not be shown again.",
      resetEmail: link.email,
      resetUrl: link.url,
    };
  } catch {
    return { error: "A reset link could not be generated for that account." };
  }
}
