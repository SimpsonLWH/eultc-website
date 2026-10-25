import Link from "next/link";

import { ExternalLinkIcon } from "@/components/ui/icons";

const publicLinks = [
  { href: "/#club", label: "Club" },
  { href: "/#weekly-tennis", label: "Weekly tennis" },
  { href: "/#clubhouse", label: "Clubhouse" },
] as const;

const linkClassName =
  "inline-flex min-h-11 items-center px-2 text-lg font-semibold text-club-900 underline-offset-[0.35em] transition-colors hover:text-club-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-club-600";

// Public navigation points back to the landing-page story from any anonymous route.
export default function PublicNav() {
  return (
    <nav aria-label="Club" className="flex items-center">
      <div className="hidden items-center gap-1 lg:flex">
        {publicLinks.map((link) => (
          <Link key={link.href} href={link.href} className={linkClassName}>
            {link.label}
          </Link>
        ))}
      </div>

      <details className="group relative lg:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-none px-2 text-lg font-semibold text-club-900 marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600 [&::-webkit-details-marker]:hidden">
          Menu
        </summary>
        <div className="absolute top-[calc(100%+0.6rem)] right-0 z-50 grid min-w-56 gap-1 bg-cream p-3">
          {publicLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.eusu.ed.ac.uk/organisation/tennis"
            target="_blank"
            rel="noreferrer"
            className={linkClassName}
          >
            Join EULTC
            <ExternalLinkIcon className="ml-2 size-4" />
          </a>
        </div>
      </details>
    </nav>
  );
}
