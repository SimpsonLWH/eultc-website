import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getPlayerByEmail, getUserRoleByEmail } from "@/lib/db";

// Credentials are intentionally a local shortcut; production requires an explicit opt-in.
export function isDevLoginEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.AUTH_DEV_LOGIN === "true";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Keep Auth.js handlers and server helpers on one JWT-backed configuration.
export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/auth",
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  // This app trusts requests forwarded through its configured Next.js host/proxy.
  trustHost: true,
  providers: isDevLoginEnabled()
    ? [
        Credentials({
          credentials: {
            email: { label: "Email", type: "email" },
          },
          async authorize(credentials) {
            const email =
              typeof credentials.email === "string"
                ? credentials.email.trim().toLowerCase()
                : "";

            if (!emailPattern.test(email)) {
              return null;
            }

            // Dev login does not prove email ownership; never expose it on a public production site.
            return { id: email, email, name: email };
          },
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.trim().toLowerCase();
      if (!email) {
        // An email-less token must not retain stale player or privilege claims.
        token.role = null;
        token.playerId = null;
        return token;
      }

      // Roles live in the T02 user_roles table; the players row supplies the
      // display name and the playerId later tickets link against.
      const [player, userRole] = await Promise.all([
        getPlayerByEmail(email),
        getUserRoleByEmail(email),
      ]);

      token.email = email;
      token.name = typeof player?.name === "string" ? player.name : email;
      token.sub = email;
      token.playerId = player?._id ? String(player._id) : null;
      token.role =
        userRole?.role === "player" || userRole?.role === "admin" ? userRole.role : null;
      return token;
    },
    async session({ session, token }) {
      // Expose only identity and authorization claims needed by server components.
      session.user.id = token.sub ?? token.email ?? "";
      session.user.playerId = typeof token.playerId === "string" ? token.playerId : null;
      session.user.role =
        token.role === "player" || token.role === "admin" ? token.role : null;
      return session;
    },
  },
});
