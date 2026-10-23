import { randomBytes } from "node:crypto";

import { connectToDatabase } from "@/lib/db/connection";
import { MembershipEntryModel } from "@/lib/db/models/membership-entry";
import { RegistrationInviteModel } from "@/lib/db/models/registration-invite";
import { normalizeEmail } from "./policy";

export const INVITE_ID = "current";

export async function isPaidMember(email: string): Promise<boolean> {
  await connectToDatabase();
  const membership = await MembershipEntryModel.exists({
    email: normalizeEmail(email),
  });
  return Boolean(membership);
}

export async function listPaidMembers() {
  await connectToDatabase();
  return MembershipEntryModel.find().sort({ email: 1 }).lean();
}

export async function addPaidMembers(emails: string[], addedBy: string) {
  await connectToDatabase();
  if (emails.length === 0) {
    return;
  }

  await MembershipEntryModel.bulkWrite(
    emails.map((email) => ({
      updateOne: {
        filter: { email: normalizeEmail(email) },
        update: {
          $setOnInsert: {
            email: normalizeEmail(email),
            addedBy,
          },
        },
        upsert: true,
      },
    }))
  );
}

export async function removePaidMember(email: string) {
  await connectToDatabase();
  return MembershipEntryModel.findOneAndDelete({
    email: normalizeEmail(email),
  }).lean();
}

export async function getActiveInvite() {
  await connectToDatabase();
  return RegistrationInviteModel.findById(INVITE_ID).lean();
}

export async function rotateRegistrationInvite(rotatedBy: string) {
  await connectToDatabase();
  const code = randomBytes(24).toString("base64url");
  return RegistrationInviteModel.findByIdAndUpdate(
    INVITE_ID,
    {
      $set: {
        code,
        rotatedBy,
        rotatedAt: new Date(),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  ).lean();
}
