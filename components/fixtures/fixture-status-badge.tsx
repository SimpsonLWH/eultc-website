import Badge from "@/components/ui/badge";
import type { FixtureStatus } from "@/lib/db/models/fixture";

const STATUS_LABELS: Record<FixtureStatus, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<FixtureStatus, "neutral" | "club" | "danger"> = {
  draft: "neutral",
  open: "club",
  closed: "neutral",
  cancelled: "danger",
};

export default function FixtureStatusBadge({
  status,
}: {
  status: FixtureStatus;
}) {
  return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>;
}
