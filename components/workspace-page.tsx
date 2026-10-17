import Badge from "@/components/ui/badge";
import Card from "@/components/ui/card";

// Page-specific copy is passed in while the preview layout remains shared.
type WorkspacePageProps = {
  title: string;
  description: string;
  sectionTitle: string;
  sectionDescription: string;
};

// Render an honest placeholder until the owning ticket delivers the workspace.
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
          Coming soon
        </Badge>
      </header>

      <Card>
        <h2 className="text-lg font-semibold text-club-950">{sectionTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {sectionDescription}
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Use Fixtures and Availability for the live matchweek flow while this
          workspace is being built.
        </p>
      </Card>
    </div>
  );
}
