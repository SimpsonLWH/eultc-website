import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { isDevLoginEnabled } from "@/lib/auth/config";
import { listRankings } from "@/lib/db/players";
import { listAdmins } from "@/lib/db/roles";
import { quickSignIn } from "./actions";
import SignInForm from "./sign-in-form";

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components). The skeleton still streams, but the branch on the
// session cannot be rendered during validation.
export const instant = false;

// Keep the page shell static while deferring its request-specific session check.
export default function SignInPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="min-h-64 rounded-surface squircle bg-surface" />}>
      <SignInContent />
    </Suspense>
  );
}

// Auth.js reads request data, so run the check after the request-time boundary.
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
        <p className="text-xs font-semibold uppercase text-club-700">EULTC Clubhouse</p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950">Sign in</h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-muted">
          Members sign in to set availability, see the team sheet and check fixtures.
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
              Development sign-in — a local session is created and no email is
              sent.
            </p>
          </div>
        ) : null}
        <SignInForm enabled={devEnabled} />
      </Card>
    </div>
  );
}

// Offer one-click player and captain sessions from the seeded dev database.
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
    // Without a database the quick buttons cannot resolve seeded accounts.
    return [];
  }
}
