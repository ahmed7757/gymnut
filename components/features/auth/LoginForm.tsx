"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

import { loginFormSchema } from "@/lib/schemas";
import { useLoginStore } from "@/stores/useLoginStore";
import { signIn } from "next-auth/react";

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const {
        email: persistedEmail,
        remember,
        showPassword,
        isLoading,
        error,
        setEmail: setPersistEmail,
        setRemember,
        toggleShowPassword,
        setIsLoading,
        setError,
        clearError,
    } = useLoginStore();

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const emailValue = watch("email");
    const passwordValue = watch("password");

    // Load persisted email when mounted
    useEffect(() => {
        if (isMounted && remember && persistedEmail) {
            setValue("email", persistedEmail);
            setValue("remember", true);
        }
    }, [isMounted, remember, persistedEmail, setValue]);

    // Memoized submit handler
    const onSubmit = useCallback(
        async (data: LoginFormData) => {
            try {
                setIsLoading(true);
                clearError();

                // Transform remember field (handle both boolean and string)
                const rememberFlag = data.remember === true || data.remember === "true" || data.remember === "on";

                // Persist email if remember me is checked
                if (rememberFlag) {
                    setPersistEmail(data.email);
                    setRemember(true);
                } else {
                    setPersistEmail("");
                    setRemember(false);
                }

                const result = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    remember: rememberFlag,
                    redirect: false,
                });

                if (result?.error) {
                    setError("Invalid email or password");
                    toast.error("Login failed", {
                        description: "Invalid email or password.",
                    });
                } else if (result?.ok) {
                    toast.success("Welcome back!", {
                        description: "You have successfully logged in.",
                    });
                    router.push("/");
                    router.refresh();
                }
            } catch (err: any) {
                const errorMessage = err?.message || "An error occurred. Please try again.";
                setError(errorMessage);
                toast.error("An error occurred", {
                    description: errorMessage,
                });
                console.error("Login error:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [router, setIsLoading, setError, clearError, setPersistEmail, setRemember]
    );

    // Memoized Google sign-in handler
    const handleGoogleSignIn = useCallback(async () => {
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch (err) {
            toast.error("Google sign-in failed", {
                description: "Please try again later.",
            });
        }
    }, []);


    // Memoized submit button content
    const submitButtonContent = useMemo(() => {
        if (isLoading) {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                </>
            );
        }
        return "Log In";
    }, [isLoading]);

    // Loading skeleton
    if (!isMounted) {
        return (
            <Card className="w-full max-w-[440px] glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden border-none">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-white/10 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mx-auto"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                    <div className="h-12 bg-white/10 rounded"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-[440px]  glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden border-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                    <p className="text-slate-400 text-sm">Enter your details to access your dashboard</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg h-12 transition-all group text-white hover:text-white"
                    onClick={handleGoogleSignIn}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium">Continue with Google</span>
                </Button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-xs text-slate-500 font-medium uppercase tracking-wider">Or Login with Email</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                            Email Address
                        </Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isLoading}
                                autoComplete="email"
                                className="w-full input-glass rounded-lg h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary border-none"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                            Password
                        </Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                disabled={isLoading}
                                autoComplete="current-password"
                                className="w-full input-glass rounded-lg h-11 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary border-none"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                id="remember"
                                {...register("remember")}
                                className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/50 w-4 h-4 data-[state=checked]:bg-primary data-[state=checked]:text-white border-none"
                            />
                            <Label
                                htmlFor="remember"
                                className="text-xs text-slate-400 font-normal cursor-pointer"
                            >
                                Remember me
                            </Label>
                        </div>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        className="mt-2 w-full h-11 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(37,106,244,0.3)] hover:shadow-[0_0_25px_rgba(37,106,244,0.5)]"
                        type="submit"
                        disabled={isLoading || !isValid}
                    >
                        {submitButtonContent}
                    </Button>
                </form>

                <div className="text-center mt-2">
                    <p className="text-xs text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-white hover:text-primary transition-colors">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </Card>
    );
}
