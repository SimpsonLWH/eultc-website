import Card from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

// Deliberate placeholder for a sheet with nothing to show yet.
export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase text-club-700">
          Matchweek
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-club-950 sm:text-3xl">
          Team sheet
        </h1>
      </header>
      <Card>
        <div className="rounded-control squircle bg-surface-muted p-5 text-center">
          <h2 className="font-semibold text-club-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        </div>
      </Card>
    </div>
  );
}
