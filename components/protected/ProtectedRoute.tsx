'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Debug logging
        console.log(`[ProtectedRoute] Status: ${status}, Session: ${session ? 'exists' : 'null'}, Mounted: ${isMounted}`);

        if (isMounted && status === 'unauthenticated' && !isRedirecting) {
            console.log('[ProtectedRoute] Redirecting to login...');
            setIsRedirecting(true);
            // Use replace instead of push to avoid back button issues
            router.replace('/login');
        }
    }, [isMounted, status, router, isRedirecting, session]);

    // Show loading state while checking authentication
    if (!isMounted || status === 'loading') {
        return (
            fallback || (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600 mb-4" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            )
        );
    }

    // Show redirecting state only if we're actually redirecting
    if (isRedirecting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600 mb-4" />
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Show redirecting state for unauthenticated users
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-green-600 mb-4" />
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Render protected content for authenticated users
    return <>{children}</>;
}
