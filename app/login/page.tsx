"use client";
import { create } from "zustand";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Loader2,
    Dumbbell,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";

interface LoginStoreState {
    email: string;
    password: string;
    error: string;
    loading: boolean;
    remember: boolean;
    showPassword: boolean;
}

interface LoginStoreActions {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    setRemember: (remember: boolean) => void;
    setShowPassword: (showPassword: boolean) => void;
}

type LoginStore = LoginStoreState & LoginStoreActions;

const useLoginStore = create<LoginStore>((set) => ({
    email: "",
    password: "",
    error: "",
    loading: false,
    remember: false,
    showPassword: false,
    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),
    setError: (error: string) => set({ error }),
    setLoading: (loading: boolean) => set({ loading }),
    setRemember: (remember: boolean) => set({ remember }),
    setShowPassword: (showPassword: boolean) => set({ showPassword }),
}));

const Login = () => {
    const router = useRouter();
    const {
        email,
        password,
        error,
        loading,
        remember,
        showPassword,
        setEmail,
        setPassword,
        setError,
        setLoading,
        setRemember,
        setShowPassword,
    } = useLoginStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.replace("/");
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (err) {
            setError("Google sign-in failed. Please try again.");
        }
    };

    // ✅ helper to render checkmarks
    const renderInputWithCheck = (
        id: string,
        props: any,
        value: string,
        error?: string
    ) => (
        <div className="relative">
            <Input id={id} {...props} />
            {value && !error && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
                <CardHeader className="text-center space-y-3 pb-6">
                    <div className="flex items-center justify-center gap-3 text-green-600">
                        <Dumbbell className="h-10 w-8" />
                        <h1 className="text-3xl font-bold">GymNut</h1>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-800">Welcome back!</CardTitle>
                    <CardDescription className="text-gray-600 text-base">Sign in to continue your fitness journey</CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                            {renderInputWithCheck(
                                "email",
                                {
                                    type: "email",
                                    placeholder: "Enter your email",
                                    className: "h-12 text-base",
                                    value: email,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                    required: true,
                                },
                                email,
                                error
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="h-12 text-base pr-12"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={remember}
                                    onCheckedChange={(v) => setRemember(!!v)}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Remember me
                                </Label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={loading || !email || !password}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        onClick={handleGoogle}
                    >
                        <FaGoogle className="h-5 w-5" />
                        Continue with Google
                    </Button>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
                        >
                            Sign up here
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;
