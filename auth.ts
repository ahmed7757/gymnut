import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/utils/password";
import { loginSchema } from "./lib/zod";
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
            },
            authorize: async (credentials) => {
                try {
                    const { email, password } = await loginSchema.parseAsync(credentials);

                    // 1- check if user exists
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (!user) return null;

                    // 2- compare password
                    if (!user.password || typeof user.password !== "string") return null;
                    const isValid = await comparePassword(password, user.password);
                    if (!isValid) return null;

                    // 3- return user object (without password)
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
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
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token?.sub) {
                session.user.id = token.sub;
            }
            console.log(token)
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});
