import WorkspacePage from "@/components/workspace-page";

// Configure the shared placeholder shell for the season fixture list.
export default function FixturesPage() {
  return (
    <WorkspacePage
      title="Fixtures"
      description="Keep upcoming matches, venues and results in one place."
      sectionTitle="Season schedule"
      sectionDescription="League fixtures and match results will appear here."
    />
  );
}