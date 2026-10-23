import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { isDevLoginEnabled } from "@/lib/auth/dev-login";
import { listRankings } from "@/lib/db/players";
import { listAdmins } from "@/lib/db/roles";
import { quickSignIn } from "./actions";
import SignInForm from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export const instant = false;

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  await connection();

  if (await getCurrentUser()) {
    redirect("/");
  }

  const devEnabled = isDevLoginEnabled();
  const quickAccounts = devEnabled ? await devQuickAccounts() : [];

  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12">
      <Card>
        <p className="text-xs font-semibold uppercase text-club-700">
          EULTC Clubhouse
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950">Sign in</h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-muted">
          Paid members can set availability, see the team sheet and check
          fixtures.
        </p>
        {quickAccounts.length > 0 ? (
          <div className="mb-6 space-y-2">
            {quickAccounts.map((account) => (
              <form key={account.email} action={quickSignIn}>
                <input name="email" type="hidden" value={account.email} />
                <Button className="w-full" type="submit" variant="secondary">
                  Continue as {account.label}
                </Button>
              </form>
            ))}
            <p className="text-xs leading-5 text-muted">
              Development sign-in — no email is sent.
            </p>
          </div>
        ) : null}
        <SignInForm />
        <p className="mt-5 text-xs leading-5 text-muted">
          New member? Use the private registration link from a captain.
        </p>
      </Card>
    </div>
  );
}

async function devQuickAccounts() {
  try {
    const [players, admins] = await Promise.all([listRankings(), listAdmins()]);
    const accounts: Array<{ label: string; email: string }> = [];

    if (players[0]) {
      accounts.push({ label: players[0].name, email: players[0].email });
    }
    if (admins[0]) {
      accounts.push({ label: "club captain", email: admins[0].email });
    }

    return accounts;
  } catch {
    return [];
  }
}
