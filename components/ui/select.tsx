import type { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-10 w-full min-w-0 rounded-control squircle border border-control bg-surface px-3 py-2 text-sm text-ink focus:border-club-600 focus:outline-2 focus:outline-club-200 disabled:bg-surface-muted ${className}`}
      {...props}
    />
  );
}
