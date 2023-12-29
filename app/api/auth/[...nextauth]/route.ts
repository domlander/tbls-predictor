import NextAuth from "next-auth/next";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET ?? "",
      profile(profile) {
        return {
          id: profile?.sub ?? "",
          email: profile?.email ?? "",
          emailVerified: profile?.email_verified ?? "",
          username: profile?.name ?? "",
          image: profile?.picture ?? "",
        };
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user?.id) {
        return {
          ...session,
          user: {
            ...user,
          },
        };
      }
      return session;
    },
  },
  theme: {
    colorScheme: "dark",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
