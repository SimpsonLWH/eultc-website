import type { InputHTMLAttributes } from "react";

// Reuse one accessible focus and sizing treatment for native input controls.
export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-10 w-full min-w-0 rounded-control squircle border border-control bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-club-600 focus:outline-2 focus:outline-club-200 disabled:bg-surface-muted ${className}`}
      {...props}
    />
  );
}
