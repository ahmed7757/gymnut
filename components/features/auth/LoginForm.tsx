"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { AuthService } from "@/lib/api/services/authService";
import { loginSchema } from "@/lib/schemas";
import { useAuthStore } from "@/stores/useAuthStore";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const remember = watch("remember");

    async function onSubmit(data: LoginFormData) {
        setIsLoading(true);
        try {
            const result = await AuthService.login(data);

            if (!result?.error) {
                // Fetch current user to update store
                const user = await AuthService.getCurrentUser();
                // setUser(user); // Optimization: Zustand might be updated by session provider, but manual check is safe

                toast.success("Welcome back!", {
                    description: "You have successfully logged in.",
                });

                router.push("/dashboard");
                router.refresh();
            } else {
                toast.error("Login failed", {
                    description: "Invalid email or password.",
                });
            }
        } catch (error) {
            toast.error("An error occurred", {
                description: "Please try again later."
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="w-full max-w-[440px] glass-card rounded-2xl p-8 shadow-2xl relative overflow-hidden border-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

            <div className="flex flex-col gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                    <p className="text-slate-400 text-sm">Enter your details to access your dashboard</p>
                </div>

                <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg h-12 transition-all group text-white hover:text-white"
                    onClick={() => { /* Google Auth Logic */ }}
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
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <span className="material-symbols-outlined text-[20px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg></span>
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                disabled={isLoading}
                                className="w-full input-glass rounded-lg h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary border-none"
                                {...register("email")}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-300">Password</Label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                                <span className="material-symbols-outlined text-[20px]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg></span>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                disabled={isLoading}
                                className="w-full input-glass rounded-lg h-11 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-primary border-none"
                                {...register("password")}
                            />
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox
                                id="remember"
                                checked={remember}
                                onCheckedChange={(checked) => setValue("remember", checked as boolean)}
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

                    <Button
                        className="mt-2 w-full h-11 bg-primary hover:bg-primary/90 rounded-lg text-white text-sm font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(37,106,244,0.3)] hover:shadow-[0_0_25px_rgba(37,106,244,0.5)]"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Log In
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
