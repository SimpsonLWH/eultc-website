import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";

import Card from "@/components/ui/card";
import ResetPasswordForm from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    token?: string | string[];
  }>;
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
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string | string[];
    token?: string | string[];
  }>;
}) {
  await connection();

  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12">
      <Card>
        <p className="text-xs font-semibold uppercase text-club-700">
          EULTC Clubhouse
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950">
          Set a new password
        </h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-muted">
          This link can be used once and expires one hour after a captain
          generates it.
        </p>
        {token && !error ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="space-y-4">
            <p className="rounded-surface squircle bg-surface-muted p-4 text-sm leading-6 text-muted">
              This password reset link is invalid or has expired.
            </p>
            <Link
              className="text-sm font-semibold text-club-700 underline-offset-4 hover:underline"
              href="/sign-in"
            >
              Return to sign in
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
