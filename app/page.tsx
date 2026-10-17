import Link from "next/link";
import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

// These links are the dashboard's entry points into the club's main workflows.
const workspaces = [
  {
    title: "Availability",
    description: "Collect player responses for the next matchweek.",
    href: "/availability",
  },
  {
    title: "Team selection",
    description: "Review the squad and prepare match lineups.",
    href: "/selection",
  },
  {
    title: "Team sheet",
    description: "Publish and share the selected teams.",
    href: "/team-sheet",
  },
  {
    title: "Fixtures",
    description: "Keep the season schedule and results together.",
    href: "/fixtures",
  },
];

// Show the club overview and shortcuts to each workspace.
export default function Home() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase text-club-700">
              Club overview
            </p>
            <Badge variant="club">Season 2026/27</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-club-950 sm:text-3xl">
            Match operations
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Availability, selection and matchday information for Edinburgh
            University Lawn Tennis Club.
          </p>
        </div>
      </section>

      <section aria-label="Club workspaces" className="grid gap-4 sm:grid-cols-2">
        {workspaces.map((workspace) => (
          <Card key={workspace.href} className="flex min-w-0 flex-col">
            <h2 className="text-base font-semibold text-club-900">
              {workspace.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
              {workspace.description}
            </p>
            <Link
              className="mt-5 inline-flex min-h-10 items-center self-start rounded-md text-sm font-semibold text-club-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600"
              href={workspace.href}
            >
              Open workspace
            </Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
