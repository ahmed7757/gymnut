'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Zap } from 'lucide-react';
import { FormInput, ErrorMessage } from '@/components/ui/FormInput';
import { loginSchema } from '@/lib/schemas';
import { useLoginStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AuthDivider } from './AuthDivider';
import { AuthLink } from './AuthLink';
import { useCallback, useMemo, useEffect, useState } from 'react';

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [isMounted, setIsMounted] = useState(false);

    const {
        email,
        error,
        loading,
        remember,
        showPassword,
        setEmail,
        setError,
        setLoading,
        setRemember,
        setShowPassword,
    } = useLoginStore();

    // Ensure component is mounted before rendering to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        handleAuthError,
        handleCredentialsSignIn,
        handleGoogleSignIn,
        router,
    } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: { email: '', password: '' },
    });

    // Load persisted email when component mounts and remember is true
    useEffect(() => {
        if (isMounted && remember && email) {
            setValue('email', email);
        }
    }, [isMounted, remember, email, setValue]);

    const emailValue = watch('email');
    const passwordValue = watch('password');

    // Memoized form submission handler
    const onSubmit = useCallback(async (data: LoginFormData) => {
        try {
            setLoading(true);
            setError('');

            // Persist email if remember me is checked
            if (remember) {
                setEmail(data.email);
            }

            await handleCredentialsSignIn(data.email, data.password, remember);
            router.replace('/');
        } catch (err: any) {
            setError(handleAuthError(err));
        } finally {
            setLoading(false);
        }
    }, [handleCredentialsSignIn, handleAuthError, router, setError, setLoading, remember, setEmail]);

    // Memoized Google sign-in handler
    const handleGoogleClick = useCallback(() => {
        handleGoogleSignIn();
    }, [handleGoogleSignIn]);

    // Memoized password toggle handler
    const togglePassword = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword, setShowPassword]);

    // Memoized remember me handler
    const handleRememberChange = useCallback((checked: boolean) => {
        setRemember(checked);
        // If unchecking remember me, clear the persisted email
        if (!checked) {
            setEmail('');
        }
    }, [setRemember, setEmail]);

    // Memoized submit button content
    const submitButtonContent = useMemo(() => {
        if (loading) {
            return (
                <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Start Your Journey
            </div>
        );
    }, [loading]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
                {/* Email Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Email Address
                    </Label>
                    <FormInput
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        value={emailValue || ''}
                        autoComplete="email"
                        {...register('email')}
                        className="focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-200"
                    />
                    <ErrorMessage message={errors.email?.message} />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="password"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Password
                    </Label>
                    <FormInput
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        showPassword={showPassword}
                        onTogglePassword={togglePassword}
                        error={errors.password?.message}
                        value={passwordValue || ''}
                        autoComplete="current-password"
                        showValidationIcon={false}
                        {...register('password')}
                        className="focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-200"
                    />
                    <ErrorMessage message={errors.password?.message} />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onCheckedChange={handleRememberChange}
                            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            Remember me
                        </Label>
                    </div>
                    <AuthLink href="/forgot-password">
                        Forgot password?
                    </AuthLink>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={loading || !isValid}
                >
                    {submitButtonContent}
                </Button>
            </form>

            <AuthDivider />

            <GoogleSignInButton onClick={handleGoogleClick} disabled={loading} />

            <p className="mt-8 text-center text-sm text-gray-600">
                New to your fitness journey?{' '}
                <AuthLink href="/register">
                    Join the community
                </AuthLink>
            </p>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 italic">
                    "Transform your body, fuel your dreams" 🌱
                </p>
            </div>
        </>
    );
}
