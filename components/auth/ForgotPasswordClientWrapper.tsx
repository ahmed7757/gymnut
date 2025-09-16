'use client';

import { useForgotPasswordStore } from '@/stores/authStore';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ForgotPasswordSuccess } from './ForgotPasswordSuccess';
import { useEffect, useState } from 'react';

export function ForgotPasswordClientWrapper() {
    const [isMounted, setIsMounted] = useState(false);
    const { success } = useForgotPasswordStore();

    // Ensure component is mounted before rendering to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (success) {
        return <ForgotPasswordSuccess />;
    }

    return <ForgotPasswordForm />;
}
