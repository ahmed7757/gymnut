import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/utils/password";
import { loginSchema } from "./lib/schemas";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
        remember: { type: "boolean" },
      },
      authorize: async (credentials) => {
        try {
          console.log("Auth attempt for:", credentials?.email);
          const { email, password, remember } = await loginSchema.parseAsync(credentials);

          // 1- check if user exists
          const user = await prisma.user.findUnique({ where: { email } });
          console.log("User found:", !!user);
          if (!user) return null;

          // 2- compare password
          if (!user.password || typeof user.password !== "string") return null;
          console.log("Password exists:", !!user.password);
          const isValid = await comparePassword(password, user.password);
          console.log("Password valid:", isValid);
          if (!isValid) return null;

          // 3- return user object (without password) with remember flag
          console.log("Auth successful for:", user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            remember: remember,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.flatten());
            return null;
          }
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Debug logging
      console.log(`[JWT Callback] Trigger: ${trigger}, User: ${user ? 'exists' : 'null'}, Token: ${token ? 'exists' : 'null'}`);

      // If user is signing in, add user info to token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        console.log(`[JWT Callback] Added user info to token:`, { id: user.id, email: user.email });
      }

      return token;
    },
    async session({ session, token }) {
      console.log(`[Session Callback] Token: ${token ? 'exists' : 'null'}, Session: ${session ? 'exists' : 'null'}`);

      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        console.log(`[Session Callback] Session populated with user:`, { id: token.id, email: token.email });
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  secret: process.env.AUTH_SECRET,
});
