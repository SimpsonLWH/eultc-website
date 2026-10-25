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

export function ListOrderedIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 5.5h1v3M3.5 8.5h2M3.5 13.5h2l-2 2.5h2M3.5 19.5h2v-2h-2v-1h2" />
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

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5" />
    </svg>
  );
}

export function UserPlusIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M3.5 19.5c0-3 2.45-5.25 5.5-5.25s5.5 2.25 5.5 5.25" />
      <path d="M18 8v6M15 11h6" />
    </svg>
  );
}

export function TennisCourtIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M12 5v14M3 9h3v6H3M21 9h-3v6h3" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.68l7.73-8.84L1.25 2.25h6.82l4.72 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}
