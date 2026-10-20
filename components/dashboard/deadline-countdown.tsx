"use client";

import { useEffect, useState } from "react";

type DeadlineCountdownProps = {
  /** ISO instant of the availability deadline. */
  deadline: string;
  /** Whether signup is still open; closed signups render a fixed label. */
  open: boolean;
};

function formatRemaining(deadline: string): string {
  const remainingMs = new Date(deadline).getTime() - Date.now();
  if (remainingMs <= 0) {
    return "Sign-up closed";
  }

  const totalMinutes = Math.floor(remainingMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `Sign-up closes in ${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `Sign-up closes in ${hours}h ${minutes}m`;
  }
  return `Sign-up closes in ${minutes}m`;
}

// Live countdown refreshed every 30 seconds; renders after mount so server
// and client markup match.
export default function DeadlineCountdown({
  deadline,
  open,
}: DeadlineCountdownProps) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setLabel(open ? formatRemaining(deadline) : "Sign-up closed");
    }
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, [deadline, open]);

  return (
    <span className="text-sm font-semibold text-club-800" aria-live="polite">
      {label ?? "…"}
    </span>
  );
}
