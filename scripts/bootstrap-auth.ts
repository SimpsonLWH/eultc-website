import { existsSync } from "node:fs";

import { connectToDatabase } from "../lib/db/connection";
import { UserRoleModel } from "../lib/db/models/user-role";
import {
  getActiveInvite,
  rotateRegistrationInvite,
} from "../lib/membership/store";
import { buildRegistrationUrl } from "../lib/membership/admin-policy";
import { normalizeEmail } from "../lib/membership/policy";

function loadEnvFiles() {
  for (const file of [".env.local", ".env"]) {
    if (existsSync(file)) {
      process.loadEnvFile(file);
    }
  }
}

function argument(name: string): string | null {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1]?.trim() || null : null;
}

async function main() {
  loadEnvFiles();
  const email = normalizeEmail(argument("email") ?? "");
  const name = argument("name") ?? "Club Captain";
  const baseURL = process.env.BETTER_AUTH_URL?.trim();

  if (!email || !email.includes("@")) {
    throw new Error(
      'Usage: npm run auth:bootstrap -- --email captain@example.com --name "Club Captain"'
    );
  }
  if (!baseURL) {
    throw new Error("BETTER_AUTH_URL is required.");
  }

  const connection = await connectToDatabase();
  try {
    await UserRoleModel.syncIndexes();
    await UserRoleModel.updateOne(
      { email },
      { $set: { email, role: "admin" } },
      { upsert: true, runValidators: true }
    );

    const invite =
      (await getActiveInvite()) ??
      (await rotateRegistrationInvite("auth-bootstrap"));
    if (!invite) {
      throw new Error("The registration invite could not be created.");
    }

    console.log(`Admin email provisioned: ${email}`);
    console.log(`Registration name hint: ${name}`);
    console.log(
      `Registration link: ${buildRegistrationUrl(baseURL, invite.code)}`
    );
    console.log(
      "Open the link and create the admin account with a password of at least 12 characters."
    );
  } finally {
    await connection.disconnect();
  }
}

main().catch((error) => {
  console.error("Auth bootstrap failed");
  console.error(error);
  process.exitCode = 1;
});
