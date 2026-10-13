import type { DefaultSession } from "next-auth";

// Add the app's identity and roster authorization claims to Auth.js sessions.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      playerId: string | null;
      role: "player" | "admin" | null;
    } & DefaultSession["user"];
  }
}

// Carry database-derived claims in the encrypted JWT between requests.
declare module "next-auth/jwt" {
  interface JWT {
    playerId?: string | null;
    role?: "player" | "admin" | null;
  }
}