"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Keep destinations and compact mobile labels together so the nav stays consistent.
const navigationItems = [
  { href: "/availability", label: "Availability", compactLabel: "Avail." },
  { href: "/selection", label: "Selection", compactLabel: "Select" },
  { href: "/team-sheet", label: "Team sheet", compactLabel: "Teams" },
  { href: "/fixtures", label: "Fixtures", compactLabel: "Fixtures" },
];

// Highlight the current route and shorten labels when the viewport is narrow.
export default function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Clubhouse" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-4 px-2 sm:px-6">
        {navigationItems.map((item) => {
          // Exact matching avoids marking a sibling destination as active.
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-12 min-w-0 items-center justify-center border-b-2 px-1 text-center text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-club-600 sm:justify-start sm:px-3 sm:text-sm ${
                isActive
                  ? "border-club-700 text-club-700"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-club-800"
              }`}
            >
              <span className="sm:hidden">{item.compactLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}