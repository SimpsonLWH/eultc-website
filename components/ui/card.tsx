import type { HTMLAttributes } from "react";

// Provide the shared framed surface while forwarding semantic section attributes.
export default function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`rounded-surface squircle border border-line bg-surface p-5 sm:p-6 ${className}`}
      {...props}
    />
  );
}
