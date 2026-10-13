import type { InputHTMLAttributes } from "react";

// Reuse one accessible focus and sizing treatment for native input controls.
export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-club-600 focus:outline-2 focus:outline-club-200 disabled:bg-slate-100 ${className}`}
      {...props}
    />
  );
}