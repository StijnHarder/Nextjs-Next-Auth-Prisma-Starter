import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashed_password
        );
        if (!isValid) throw new Error("Incorrect password");

        return {
          id: user.id,
          username: user.username,
          domain_url: user.domain_url,
          admin: user.admin,
          api_key_hash: user.api_key_hash,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.admin = user.admin;
        token.domain_url = user.domain_url;
        token.api_key_hash = user.api_key_hash;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.admin = token.admin;
        session.user.domain_url = token.domain_url;
        session.user.api_key_hash = token.api_key_hash;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
