import "server-only";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db/connection";
import { PlayerModel } from "@/lib/db/models/player";

export function isDevLoginEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.AUTH_DEV_LOGIN === "true";
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/auth",
  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
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

            return { id: email, email, name: email };
          },
        }),
      ]
    : [],
  callbacks: {
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.trim().toLowerCase();
      if (!email) {
        token.role = null;
        token.playerId = null;
        return token;
      }

      await connectToDatabase();
      const player = await PlayerModel.collection.findOne(
        { email },
        { projection: { _id: 1, name: 1, role: 1 } }
      );

      token.email = email;
      token.name = typeof player?.name === "string" ? player.name : email;
      token.sub = email;
      token.playerId = player?._id ? String(player._id) : null;
      token.role = player?.role === "player" || player?.role === "admin" ? player.role : null;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub ?? token.email ?? "";
      session.user.playerId = typeof token.playerId === "string" ? token.playerId : null;
      session.user.role =
        token.role === "player" || token.role === "admin" ? token.role : null;
      return session;
    },
  },
});