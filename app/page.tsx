import { Suspense } from "react";
import { connection } from "next/server";

import ClubLanding from "@/components/club-landing";
import Dashboard from "@/components/dashboard/dashboard";
import { getCurrentUser } from "@/lib/auth";

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components). The skeleton still streams, but the branch on the
// session cannot be rendered during validation.
export const instant = false;

// Visitors get the club landing page; members get the matchweek dashboard.
export default function Home() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  await connection();
  const user = await getCurrentUser();

  return user ? <Dashboard user={user} /> : <ClubLanding />;
}
