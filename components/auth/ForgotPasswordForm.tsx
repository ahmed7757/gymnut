'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema } from '@/lib/schemas';
import { useForgotPasswordStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { FormInput, ErrorMessage } from '@/components/ui/FormInput';
import { ErrorAlert } from './ErrorAlert';
import { AuthLink } from './AuthLink';
import { useCallback, useEffect, useState } from 'react';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const [isMounted, setIsMounted] = useState(false);

    const {
        email,
        error,
        isLoading,
        validEmail,
        emailFocus,
        setEmail,
        setError,
        setIsLoading,
        setValidEmail,
        setEmailFocus,
    } = useForgotPasswordStore();

    // Ensure component is mounted before rendering to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { handleAuthError, handleForgotPassword } = useAuth();

    const {
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
    });

    // Memoized email change handler
    const onEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setValue('email', value);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setValidEmail(emailRegex.test(value));
    }, [setEmail, setValue, setValidEmail]);

    // Memoized form submission handler
    const onSubmit = useCallback(async (data: ForgotPasswordFormData) => {
        if (!validEmail) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await handleForgotPassword(data.email);
            // Success state is handled by the parent component
        } catch (err: any) {
            setError(handleAuthError(err));
        } finally {
            setIsLoading(false);
        }
    }, [validEmail, handleForgotPassword, handleAuthError, setError, setIsLoading]);

    // Memoized focus handlers
    const handleEmailFocus = useCallback(() => {
        setEmailFocus(true);
    }, [setEmailFocus]);

    const handleEmailBlur = useCallback(() => {
        setEmailFocus(false);
    }, [setEmailFocus]);

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

    return (
        <>
            <ErrorAlert error={error} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                    >
                        Email address
                    </Label>
                    <FormInput
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        error={errors.email?.message}
                        onChange={onEmailChange}
                        onFocus={handleEmailFocus}
                        onBlur={handleEmailBlur}
                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {emailFocus && email && !validEmail && (
                        <p className="text-sm text-red-600">
                            Please enter a valid email address.
                        </p>
                    )}
                    <ErrorMessage message={errors.email?.message} />
                </div>

                <Button
                    type="submit"
                    disabled={!validEmail || isLoading}
                    className="w-full h-11 rounded-full bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                        </div>
                    ) : (
                        'Send reset link'
                    )}
                </Button>
            </form>

            <div className="text-center mt-6">
                <AuthLink href="/login">
                    ← Back to login
                </AuthLink>
            </div>
        </>
    );
}
