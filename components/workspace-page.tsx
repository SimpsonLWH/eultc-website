import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";

// Page-specific copy is passed in while the preview layout remains shared.
type WorkspacePageProps = {
  title: string;
  description: string;
  sectionTitle: string;
  sectionDescription: string;
};

// Render the common heading, search controls, status, and preview panels.
export default function WorkspacePage({
  title,
  description,
  sectionTitle,
  sectionDescription,
}: WorkspacePageProps) {
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-club-700">
            Match operations
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        <Badge variant="club" className="self-start sm:self-auto">
          Workspace preview
        </Badge>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(16rem,1fr)]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {sectionTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {sectionDescription}
              </p>
            </div>
            <Badge variant="neutral">Not live</Badge>
          </div>
          <label
            htmlFor="player-search"
            className="mt-6 block text-sm font-medium text-slate-700"
          >
            Player search
          </label>
          <Input
            id="player-search"
            className="mt-2"
            placeholder="Search players"
            type="search"
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <Button>Open workspace</Button>
            <Button variant="secondary">View details</Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">
              Getting started
            </p>
            <h2 className="mt-2 text-lg font-semibold text-club-950">
              Ready for club data
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This area will show current season information once the club
              workspace is connected.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <Badge variant="court">Setup pending</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}