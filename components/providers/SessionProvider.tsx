'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

interface SessionProviderProps {
    children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider
            // Add some configuration to help with debugging
            refetchInterval={0} // Disable automatic refetching
            refetchOnWindowFocus={false} // Disable refetch on window focus
        >
            {children}
        </NextAuthSessionProvider>
    );
}
