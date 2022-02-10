import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const options = {
  site: process.env.NEXTAUTH_URL,
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    }),
  ],
  database: {
    type: "postgres",
    host: process.env.POSTGRESQL_HOST,
    port: 5432,
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
    ssl: false,
  },
  session: {
    strategy: "database",
  },
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      if (session?.user && user?.id) {
        return {
          ...session,
          user: {
            ...user,
            id: user.id,
            name: user.name,
          },
        };
      }
      return session;
    },
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#0D151C",
  },
};

export default (req, res) => NextAuth(req, res, options);
