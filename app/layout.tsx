import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import Link from "next/link";
import Nav from "@/components/nav";
import { PlayerGate } from "@/lib/auth/player-gate";
import { SessionHeader } from "@/lib/auth/session-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EULTC | Clubhouse",
  description:
    "Edinburgh University Lawn Tennis Club availability, team selection, team sheets and fixtures.",
};

// Share the club shell while streaming session checks behind independent fallbacks.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-club-600"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-club-800 text-sm font-bold text-white">
                EU
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-club-900">
                  Edinburgh University
                </span>
                <span className="block truncate text-xs text-slate-500">
                  Lawn Tennis Club
                </span>
              </span>
            </Link>
            <Suspense
              fallback={<span className="h-9 w-24 animate-pulse rounded bg-slate-100" />}
            >
              <SessionHeader />
            </Suspense>
          </div>
        </header>
        <Nav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-6 sm:py-10">
          <Suspense
            fallback={<div aria-busy="true" className="min-h-48 rounded-md bg-white" />}
          >
            {/* Show the not-listed state without embedding auth checks in each public page. */}
            <PlayerGate>{children}</PlayerGate>
          </Suspense>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <span>Edinburgh University Lawn Tennis Club</span>
            <span>Clubhouse · Team operations</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
