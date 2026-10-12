import type { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "club" | "court";
};

const variantClasses = {
  neutral: "bg-slate-100 text-slate-700",
  club: "bg-club-50 text-club-800 ring-1 ring-inset ring-club-200",
  court: "bg-rose-50 text-court-600 ring-1 ring-inset ring-rose-200",
};

export default function Badge({
  className = "",
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}