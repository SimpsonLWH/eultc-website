import type { ButtonHTMLAttributes } from "react";

// Preserve native button attributes while exposing the shared club variants.
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
};

// Centralize button colors so actions stay consistent across pages.
const variantClasses = {
  primary:
    "glass-primary bg-club-700 text-white hover:bg-club-800 disabled:bg-club-300",
  secondary:
    "material-control text-club-800 hover:border-club-300 hover:bg-club-50 disabled:text-muted",
  quiet: "text-club-700 hover:bg-club-700/10 disabled:text-muted",
};

// Default to a non-submitting button to avoid accidental form submissions.
export default function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-10 items-center justify-center rounded-control squircle px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
