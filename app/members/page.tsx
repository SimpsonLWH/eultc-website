import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import InviteManager from "@/components/members/invite-manager";
import PaidMembersManager from "@/components/members/paid-members-manager";
import ResetLinkButton from "@/components/members/reset-link-button";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { listMemberAccounts } from "@/lib/auth/admin-data";
import { requireAdmin } from "@/lib/auth";
import { authBaseURL } from "@/lib/auth/config";
import { getActiveInvite, listPaidMembers } from "@/lib/membership";
import { buildRegistrationUrl } from "@/lib/membership/admin-policy";

export const metadata: Metadata = {
  title: "Members",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function MembersPage() {
  return (
    <Suspense fallback={<MembersSkeleton />}>
      <MembersContent />
    </Suspense>
  );
}

async function MembersContent() {
  await connection();
  await requireAdmin();

  const [invite, paid, accounts] = await Promise.all([
    getActiveInvite(),
    listPaidMembers(),
    listMemberAccounts(),
  ]);
  const inviteUrl = invite
    ? buildRegistrationUrl(authBaseURL, invite.code)
    : null;
  const paidMembers = paid.map((entry) => ({
    email: entry.email,
    createdAt: entry.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase text-club-700">
          Captain tools
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
          Members
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Control paid eligibility, registration and account recovery. BUCS
          roster and rankings remain separate.
        </p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-club-950">
            Registration link
          </h2>
          <p className="mb-5 mt-1 text-sm leading-6 text-muted">
            Share only with current paid members. Registration also checks the
            paid email list.
          </p>
          <InviteManager inviteUrl={inviteUrl} />
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-club-950">
            Paid membership list
          </h2>
          <p className="mb-5 mt-1 text-sm leading-6 text-muted">
            Temporary manual source until the EUSU integration is available.
          </p>
          <PaidMembersManager members={paidMembers} />
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-club-950">
              Member accounts
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              Generate a one-time reset link for any account. The link expires
              after one hour.
            </p>
          </div>
          <Badge>{accounts.length} accounts</Badge>
        </div>

        {accounts.length > 0 ? (
          <ul className="mt-5 divide-y divide-line rounded-control squircle border border-line">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-ink">
                      {account.name}
                    </p>
                    <Badge variant={account.role === "admin" ? "danger" : "club"}>
                      {account.role ?? "unlinked"}
                    </Badge>
                    <Badge
                      variant={
                        account.role === "admin" || account.isPaid
                          ? "club"
                          : "neutral"
                      }
                    >
                      {account.role === "admin"
                        ? "admin bypass"
                        : account.isPaid
                          ? "paid"
                          : "unpaid"}
                    </Badge>
                    <Badge>{account.hasPlayer ? "BUCS player" : "not on roster"}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {account.email}
                  </p>
                </div>
                <ResetLinkButton userId={account.id} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-control squircle bg-surface-muted p-4 text-sm text-muted">
            No accounts have registered yet.
          </p>
        )}
      </Card>
    </div>
  );
}

function MembersSkeleton() {
  return (
    <div aria-busy="true" className="space-y-5">
      <div className="h-24 max-w-2xl rounded-surface bg-surface" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-80 rounded-surface bg-surface" />
        <div className="h-80 rounded-surface bg-surface" />
      </div>
    </div>
  );
}
