import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import Card from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getActiveInvite } from "@/lib/membership";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string | string[] }>;
}) {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <SignUpContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignUpContent({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string | string[] }>;
}) {
  await connection();

  if (await getCurrentUser()) {
    redirect("/");
  }

  const params = await searchParams;
  const suppliedInvite = Array.isArray(params.invite)
    ? params.invite[0]
    : params.invite;
  const activeInvite = await getActiveInvite();
  const validInvite = Boolean(
    suppliedInvite && activeInvite?.code === suppliedInvite
  );

  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12">
      <Card>
        <p className="text-xs font-semibold uppercase text-club-700">
          EULTC Clubhouse
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950">
          Create your account
        </h1>
        {validInvite && suppliedInvite ? (
          <>
            <p className="mb-6 mt-2 text-sm leading-6 text-muted">
              Use the email attached to your paid club membership.
            </p>
            <SignUpForm inviteCode={suppliedInvite} />
          </>
        ) : (
          <p className="mt-4 rounded-surface squircle bg-surface-muted p-4 text-sm leading-6 text-muted">
            This registration link is missing or has been rotated. Ask a
            captain for the current club link.
          </p>
        )}
      </Card>
    </div>
  );
}
