'use client';

import { useEffect, useState } from 'react';

interface HydrationBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function HydrationBoundary({ children, fallback }: HydrationBoundaryProps) {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Mark as hydrated after the component mounts
        setIsHydrated(true);
    }, []);

    // Show fallback during hydration to prevent mismatches
    if (!isHydrated) {
        return <>{fallback || children}</>;
    }

    return <>{children}</>;
}
