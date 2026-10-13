import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Card from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { isDevLoginEnabled } from "@/lib/auth/config";
import SignInForm from "./sign-in-form";

export default function SignInPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="min-h-64 rounded-md bg-white" />}>
      <SignInContent />
    </Suspense>
  );
}

async function SignInContent() {
  await connection();

  if (await getCurrentUser()) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-md py-8 sm:py-12">
      <Card>
        <p className="text-xs font-semibold uppercase text-club-700">EULTC Clubhouse</p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950">Sign in</h1>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-600">
          Use your club email address to continue.
        </p>
        <SignInForm enabled={isDevLoginEnabled()} />
      </Card>
    </div>
  );
}