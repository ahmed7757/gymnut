import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null; // If using JWT logic specific to client
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setIsAuthenticated: (status: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            token: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            logout: () => set({ user: null, isAuthenticated: false, token: null }),
        }),
        {
            name: "auth-storage", // name of the item in the storage (must be unique)
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Only persist user and auth status
        }
    )
);
