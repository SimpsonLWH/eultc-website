import type { SVGProps } from "react";

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

type IconProps = SVGProps<SVGSVGElement>;

export function CalendarCheckIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
      <path d="m9.5 15 1.8 1.8L15 12.8" />
    </svg>
  );
}

export function ClipboardListIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="5" y="4.5" width="14" height="16" rx="2.5" />
      <rect x="9" y="2.8" width="6" height="3.6" rx="1.2" />
      <path d="M9 11.5h6M9 15.5h4" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="9.2" cy="8.8" r="3.2" />
      <path d="M3.8 19.5c0-2.9 2.4-5 5.4-5s5.4 2.1 5.4 5" />
      <path d="M15.4 6.4a3.2 3.2 0 0 1 .3 6.2" />
      <path d="M17.2 14.9c1.8.6 3 2.3 3 4.6" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M8 4.5h8V9a4 4 0 0 1-8 0V4.5Z" />
      <path d="M8 6H5.8a2.6 2.6 0 0 0 2.5 4.3" />
      <path d="M16 6h2.2a2.6 2.6 0 0 1-2.5 4.3" />
      <path d="M12 13v3M10 16h4M8.5 20.5h7" />
    </svg>
  );
}
