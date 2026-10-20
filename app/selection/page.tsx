import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import WorkspacePage from "@/components/workspace-page";

// Session-gated route: opt out of instant-navigation validation (Next 16,
// Cache Components). The skeleton still streams, but the branch on the
// session cannot be rendered during validation.
export const instant = false;

// Selection is the captains' workspace; members are redirected before it renders.
export default function SelectionPage() {
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="min-h-64 rounded-surface squircle bg-surface"
        />
      }
    >
      <SelectionContent />
    </Suspense>
  );
}

async function SelectionContent() {
  await requireAdmin();

  return (
    <WorkspacePage
      title="Team selection"
      description="Review availability and prepare balanced teams for each fixture."
      sectionTitle="Selection workspace"
      sectionDescription="Squad lists and selection tools will appear here."
    />
  );
}
