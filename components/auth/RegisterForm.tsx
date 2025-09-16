'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { registerSchema } from '@/lib/schemas';
import { useRegisterStore } from '@/stores/authStore';
import { useAuth, usePasswordStrength } from '@/hooks/useAuth';
import { ErrorAlert } from './ErrorAlert';
import { GoogleSignInButton } from './GoogleSignInButton';
import { AuthDivider } from './AuthDivider';
import { AuthLink } from './AuthLink';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { InputWithValidation } from './InputWithValidation';

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const [isMounted, setIsMounted] = useState(false);

    const {
        formError,
        loading,
        showPassword,
        showConfirmPassword,
        passwordFocused,
        setFormError,
        setLoading,
        setShowPassword,
        setShowConfirmPassword,
        setPasswordFocused,
    } = useRegisterStore();

    // Ensure component is mounted before rendering to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        handleAuthError,
        handleGoogleSignIn,
        handleRegister,
        handleCredentialsSignIn,
        router,
    } = useAuth();

    const { getPasswordStrength, getPasswordRequirements } = usePasswordStrength();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
    });

    const nameValue = watch('name');
    const emailValue = watch('email');
    const passwordValue = watch('password', '');
    const confirmPasswordValue = watch('confirmPassword');

    const strength = getPasswordStrength(passwordValue);
    const requirements = getPasswordRequirements(passwordValue);
    const allRequirementsMet = requirements.every((r) => r.valid);
    const confirmPasswordValid =
        !!confirmPasswordValue &&
        confirmPasswordValue === passwordValue &&
        !errors.confirmPassword;

    // Memoized form submission handler
    const onSubmit = useCallback(async (data: RegisterFormData) => {
        try {
            setLoading(true);
            setFormError(null);
            await handleRegister(data);
            await handleCredentialsSignIn(data.email, data.password);
            router.replace('/');
        } catch (err: any) {
            setFormError(handleAuthError(err));
        } finally {
            setLoading(false);
        }
    }, [handleRegister, handleCredentialsSignIn, handleAuthError, router, setFormError, setLoading]);

    // Memoized Google sign-in handler
    const handleGoogleClick = useCallback(() => {
        handleGoogleSignIn();
    }, [handleGoogleSignIn]);

    // Memoized password toggle handlers
    const togglePassword = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword, setShowPassword]);

    const toggleConfirmPassword = useCallback(() => {
        setShowConfirmPassword(!showConfirmPassword);
    }, [showConfirmPassword, setShowConfirmPassword]);

    // Memoized focus handlers
    const handlePasswordFocus = useCallback(() => {
        setPasswordFocused(true);
    }, [setPasswordFocused]);

    const handlePasswordBlur = useCallback(() => {
        setPasswordFocused(false);
    }, [setPasswordFocused]);

    // Memoized input with check component
    const renderInputWithCheck = useCallback((
        id: string,
        props: any,
        value: string,
        error?: string
    ) => (
        <InputWithValidation
            id={id}
            hasValue={!!value}
            hasError={!!error}
            {...props}
        />
    ), []);

    // Memoized password requirements display
    const passwordRequirementsDisplay = useMemo(() => {
        return (
            <PasswordStrengthIndicator
                password={passwordValue}
                requirements={requirements}
                strength={strength}
                show={passwordFocused && !!passwordValue}
            />
        );
    }, [passwordFocused, passwordValue, strength, requirements]);

    // Prevent hydration mismatch by not rendering until mounted
    if (!isMounted) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
            <ErrorAlert error={formError} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Full Name
                    </Label>
                    {renderInputWithCheck(
                        'name',
                        {
                            placeholder: 'Enter your full name',
                            className:
                                'h-12 text-base border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20',
                            ...register('name'),
                        },
                        nameValue || '',
                        errors.name?.message
                    )}
                    {errors.name && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="gender"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Gender
                    </Label>
                    <select
                        id="gender"
                        {...register('gender')}
                        className="w-full h-12 rounded-lg border border-gray-200 bg-white px-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                    >
                        <option value="">Select your gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors.gender && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            {errors.gender.message}
                        </p>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Email Address
                    </Label>
                    {renderInputWithCheck(
                        'email',
                        {
                            type: 'email',
                            placeholder: 'name@example.com',
                            className:
                                'h-12 text-base border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20',
                            ...register('email'),
                        },
                        emailValue || '',
                        errors.email?.message
                    )}
                    {errors.email && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                    <Label
                        htmlFor="password"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            className="h-12 text-base pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                            {...register('password')}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                        {allRequirementsMet && !errors.password && (
                            <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        )}
                    </div>

                    {passwordRequirementsDisplay}

                    {errors.password && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-semibold text-gray-700"
                    >
                        Confirm Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            className="h-12 text-base pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                            {...register('confirmPassword')}
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPassword}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                        {confirmPasswordValid && (
                            <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                        )}
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                            <XCircle className="h-4 w-4" />
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 rounded-lg text-base font-semibold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={loading || !isValid || !allRequirementsMet}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Creating account...
                        </div>
                    ) : (
                        'Start Your Journey'
                    )}
                </Button>
            </form>

            <AuthDivider />

            <GoogleSignInButton onClick={handleGoogleClick} disabled={loading} />

            <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <AuthLink href="/login">
                    Sign in here
                </AuthLink>
            </p>
        </>
    );
}
