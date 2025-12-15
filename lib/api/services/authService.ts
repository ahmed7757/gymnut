import api from "@/lib/api/axios";
import { signIn, signOut, getSession } from "next-auth/react";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { z } from "zod";
import { User } from "@/types";

// Type definitions based on Zod schemas
type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export class AuthService {
    /**
     * Register a new user
     * Uses custom API endpoint via Axios
     */
    static async register(data: RegisterData) {
        const response = await api.post("/auth/register", data);
        return response.data;
    }

    /**
     * Login user
     * Uses NextAuth.js client-side signIn
     */
    static async login(data: LoginData) {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            remember: data.remember,
            redirect: false, // Handle redirection manually
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        return result;
    }

    /**
     * Logout user
     * Uses NextAuth.js client-side signOut
     */
    static async logout() {
        await signOut({ redirect: true, callbackUrl: "/login" });
    }

    /**
     * Get current session/user
     * Uses NextAuth.js getSession
     */
    static async getCurrentUser() {
        const session = await getSession();
        return session?.user as User | null;
    }

    /**
     * Forgot Password
     */
    static async forgotPassword(email: string) {
        const response = await api.post("/auth/forgot-password", { email });
        return response.data;
    }
}
