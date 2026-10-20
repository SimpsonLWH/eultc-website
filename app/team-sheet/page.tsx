import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import WorkspacePage from "@/components/workspace-page";

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components). The skeleton still streams, but the branch on the
// session cannot be rendered during validation.
export const instant = false;

// Team sheets stay inside the club: sign-in is required before the page renders.
export default function TeamSheetPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <TeamSheetContent />
    </Suspense>
  );
}

async function TeamSheetContent() {
  await requireUser();

  return (
    <WorkspacePage
      title="Team sheet"
      description="Review the selected lineup and share matchday team sheets."
      sectionTitle="Published teams"
      sectionDescription="Draft and published team sheets will appear here."
    />
  );
}
