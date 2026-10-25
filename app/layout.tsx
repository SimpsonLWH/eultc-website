import type { Metadata } from "next";
import { Suspense } from "react";
import { Schibsted_Grotesk } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { DesktopNav, MobileTabBar } from "@/components/nav";
import PublicNav from "@/components/public-nav";
import { PlayerGate } from "@/lib/auth/player-gate";
import { SessionHeader } from "@/lib/auth/session-header";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "EULTC | Edinburgh University Lawn Tennis Club",
    template: "%s | EULTC",
  },
  description:
    "Tennis at the Meadows with Edinburgh University Lawn Tennis Club. Weekly sessions, coaching, social tennis, BUCS teams and the EULTC Clubhouse.",
};

// Signed-in users get matchweek tabs; visitors get the public club story.
async function SessionDesktopNav() {
  await connection();
  return (await getCurrentUser()) ? <DesktopNav /> : <PublicNav />;
}

async function SessionMobileTabBar() {
  await connection();
  return (await getCurrentUser()) ? <MobileTabBar /> : null;
}

// Share the club shell while streaming session checks behind independent fallbacks.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${schibsted.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-enabled')}",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        {/* Faint court-green wash: the floating chrome samples the page as it scrolls. */}
        <div
          aria-hidden="true"
          className="shell-wash pointer-events-none fixed inset-0 z-0"
        />

        {/* Floating glass header: brand, session and the desktop tabs in one bar. */}
        <header className="site-header sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
          <div className="site-header-inner mx-auto w-full max-w-6xl">
            <div className="site-header-bar material-nav squircle flex items-center gap-3 rounded-float px-3 py-2">
              <Link
                href="/"
                className="flex min-w-0 items-center gap-3 rounded-control px-1 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-club-600"
              >
                {/* The badge is paired with the club name, so the alt text stays empty. */}
                <Image
                  src="/eultc-badge.png"
                  alt=""
                  width={40}
                  height={40}
                  loading="eager"
                  className="size-10 shrink-0"
                />
                <span className="min-w-0">
                  <span className="block truncate text-lg font-semibold text-club-900">
                    <span className="sm:hidden">EULTC</span>
                    <span className="hidden sm:inline">Edinburgh University</span>
                  </span>
                  <span className="hidden truncate text-[0.8125rem] text-muted min-[400px]:block">
                    Lawn Tennis Club
                  </span>
                </span>
              </Link>
              <div className="ml-auto flex items-center gap-1 sm:gap-2">
                <Suspense fallback={null}>
                  <SessionDesktopNav />
                </Suspense>
                <Suspense
                  fallback={
                    <span className="h-9 w-20 animate-pulse rounded-control bg-surface-muted" />
                  }
                >
                  <SessionHeader />
                </Suspense>
              </div>
            </div>
          </div>
        </header>

        <main className="site-main relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-10">
          <Suspense
            fallback={
              <div
                aria-busy="true"
                className="min-h-48 rounded-surface squircle bg-surface"
              />
            }
          >
            {/* Show the not-listed state without embedding auth checks in each public page. */}
            <PlayerGate>{children}</PlayerGate>
          </Suspense>
        </main>

        <footer className="site-footer relative z-10 border-t border-line bg-surface">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-muted sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <span>Edinburgh University Lawn Tennis Club</span>
            <span>Clubhouse · Team operations</span>
          </div>
        </footer>

        <Suspense fallback={null}>
          <SessionMobileTabBar />
        </Suspense>
      </body>
    </html>
  );
}
