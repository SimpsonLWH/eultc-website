"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  CalendarCheckIcon,
  ClipboardListIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/icons";

// Keep destinations, icons and labels together so both layouts stay in step.
const navigationItems = [
  { href: "/availability", label: "Availability", icon: CalendarCheckIcon },
  { href: "/selection", label: "Selection", icon: ClipboardListIcon },
  { href: "/team-sheet", label: "Team sheet", icon: UsersIcon },
  { href: "/fixtures", label: "Fixtures", icon: TrophyIcon },
];

// Desktop: inline tabs inside the floating header bar.
export function DesktopNav() {
  return (
    <nav aria-label="Clubhouse" className="hidden lg:block">
      {/* The pathname is only known at request time on dynamic routes, so the
          hook read lives in a leaf behind Suspense and the shell keeps the links. */}
      <Suspense fallback={<DesktopTabLinks activePath={null} />}>
        <ActiveDesktopTabLinks />
      </Suspense>
    </nav>
  );
}

function ActiveDesktopTabLinks() {
  const pathname = usePathname();
  return <DesktopTabLinks activePath={pathname} />;
}

function DesktopTabLinks({ activePath }: { activePath: string | null }) {
  return (
    <div className="flex items-center gap-1">
      {navigationItems.map((item) => {
        const isActive = activePath === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`inline-flex min-h-10 items-center rounded-control squircle px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-club-600 ${
              isActive
                ? "bg-club-100 font-semibold text-club-900 ring-1 ring-club-200 ring-inset"
                : "text-muted hover:bg-club-700/10 hover:text-club-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

// Mobile and tablet: fixed bottom tab bar with icons and labels.
export function MobileTabBar() {
  return (
    <>
      {/* Reserve the bar's height in the page flow so nothing hides behind it. */}
      <div
        aria-hidden="true"
        className="h-[calc(env(safe-area-inset-bottom)_+_5.5rem)] lg:hidden"
      />
      <nav
        aria-label="Clubhouse"
        className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] lg:hidden"
      >
        <div className="material-nav squircle mx-auto grid w-full max-w-md grid-cols-4 gap-0.5 rounded-float p-1">
          <Suspense fallback={<MobileTabLinks activePath={null} />}>
            <ActiveMobileTabLinks />
          </Suspense>
        </div>
      </nav>
    </>
  );
}

function ActiveMobileTabLinks() {
  const pathname = usePathname();
  return <MobileTabLinks activePath={pathname} />;
}

function MobileTabLinks({ activePath }: { activePath: string | null }) {
  return (
    <>
      {navigationItems.map((item) => {
        const isActive = activePath === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-control squircle px-1 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-club-600 ${
              isActive
                ? "bg-club-100 font-semibold text-club-800"
                : "font-medium text-muted hover:bg-club-700/10 hover:text-club-800"
            }`}
          >
            <Icon className="size-5" />
            <span className="text-[0.75rem] leading-none">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
