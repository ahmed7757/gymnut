'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useForgotPasswordStore } from '@/stores/authStore';
import { AuthLink } from './AuthLink';
import { useEffect, useState } from 'react';

export function ForgotPasswordSuccess() {
    const [isMounted, setIsMounted] = useState(false);
    const { email, setSuccess } = useForgotPasswordStore();

    // Ensure component is mounted before rendering to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Check your email
            </h1>

            <p className="text-gray-600 text-center mb-6">
                We've sent a password reset link to{' '}
                <span className="font-medium">{email}</span>
            </p>

            <div className="text-center text-sm text-gray-500 space-y-4">
                <p>Didn't receive the email? Check your spam folder or</p>
                <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                    onClick={() => setSuccess(false)}
                >
                    try again
                </Button>
            </div>

            <div className="pt-4 border-t mt-6">
                <AuthLink href="/login">
                    ← Back to login
                </AuthLink>
            </div>
        </>
    );
}
