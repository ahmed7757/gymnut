"use client";

import { create } from "zustand";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Loader2,
    Dumbbell,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import axios from "axios";
import Link from "next/link";

interface RegisterStore {
    formError: string | null;
    error: string;
    loading: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    passwordFocused: boolean;
    setFormError: (formError: string | null) => void;
    setLoading: (loading: boolean) => void;
    setShowPassword: (showPassword: boolean) => void;
    setShowConfirmPassword: (showConfirmPassword: boolean) => void;
    setPasswordFocused: (passwordFocused: boolean) => void;
}

const useRegisterStore = create<RegisterStore>((set) => ({
    formError: null,
    error: "",
    loading: false,
    showPassword: false,
    showConfirmPassword: false,
    passwordFocused: false,
    setFormError: (formError: string | null) => set({ formError }),
    setLoading: (loading: boolean) => set({ loading }),
    setShowPassword: (showPassword: boolean) => set({ showPassword }),
    setShowConfirmPassword: (showConfirmPassword: boolean) => set({ showConfirmPassword }),
    setPasswordFocused: (passwordFocused: boolean) => set({ passwordFocused }),
}))


// ✅ Schema
const registerSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        gender: z.enum(["male", "female"], {
            message: "Please select a gender",
        }),
        email: z.string().email("Invalid email format"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must include at least one uppercase letter")
            .regex(/[0-9]/, "Must include at least one number")
            .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
    const router = useRouter();
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

    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors, isValid },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        mode: "onChange", // ✅ live validation
    });

    const nameValue = watch("name");
    const emailValue = watch("email");
    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword");
    const genderValue = watch("gender");

    // ✅ Password Strength
    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        switch (score) {
            case 0:
            case 1:
                return { label: "Weak", color: "bg-red-500", textColor: "text-red-600" };
            case 2:
                return { label: "Fair", color: "bg-orange-500", textColor: "text-orange-600" };
            case 3:
                return { label: "Good", color: "bg-blue-500", textColor: "text-blue-600" };
            case 4:
                return { label: "Strong", color: "bg-green-500", textColor: "text-green-600" };
            default:
                return { label: "", color: "bg-gray-200", textColor: "text-gray-400" };
        }
    };

    const strength = getPasswordStrength(passwordValue);

    // ✅ Password requirements
    const requirements = [
        { label: "At least 8 characters", valid: passwordValue.length >= 8, icon: "🔢" },
        { label: "One uppercase letter", valid: /[A-Z]/.test(passwordValue), icon: "🔠" },
        { label: "One number", valid: /[0-9]/.test(passwordValue), icon: "123" },
        { label: "One special character", valid: /[^a-zA-Z0-9]/.test(passwordValue), icon: "!@#" },
    ];

    const allRequirementsMet = requirements.every((r) => r.valid);
    const confirmPasswordValid =
        confirmPasswordValue &&
        confirmPasswordValue === passwordValue &&
        !errors.confirmPassword;

    // ✅ Submit
    const onSubmit = async (data: RegisterForm) => {
        try {
            setLoading(true);
            setFormError(null);

            await axios.post("/api/auth/register", data);
            await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            router.replace("/");
        } catch (err: any) {
            setFormError(err?.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = () => {
        signIn("google", { callbackUrl: "/" });
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
                        <Dumbbell className="h-10 w-10" />
                        <h1 className="text-3xl font-bold">GymNut</h1>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-800">Create your account</CardTitle>
                    <CardDescription className="text-gray-600 text-base">Start your fitness journey today</CardDescription>
                </CardHeader>

                <CardContent className="px-8 pb-8">
                    {formError && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                            <div className="flex items-center gap-2">
                                <XCircle className="h-5 w-5 text-red-500" />
                                <span className="font-medium">{formError}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</Label>
                            {renderInputWithCheck(
                                "name",
                                {
                                    placeholder: "Enter your full name",
                                    className: "h-12 text-base",
                                    ...register("name")
                                },
                                nameValue,
                                errors.name?.message
                            )}
                            {errors.name && (
                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
                            <select
                                id="gender"
                                {...register("gender")}
                                className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                            >
                                <option value="">Select your gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && (
                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    {errors.gender.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
                            {renderInputWithCheck(
                                "email",
                                {
                                    type: "email",
                                    placeholder: "name@example.com",
                                    className: "h-12 text-base",
                                    ...register("email")
                                },
                                emailValue,
                                errors.email?.message
                            )}
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    className="h-12 text-base pr-12"
                                    {...register("password")}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                {!errors.password && (
                                    <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                                )}
                            </div>

                            {/* Progressive Disclosure: Show strength and requirements only when focused */}
                            {passwordFocused && passwordValue && (
                                <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    {/* Strength Indicator */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Password Strength</span>
                                            <span className={`text-sm font-semibold ${strength.textColor}`}>
                                                {strength.label}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-2 ${strength.color} transition-all duration-300 ease-out`}
                                                style={{
                                                    width: passwordValue.length === 0 ? "0%" :
                                                        passwordValue.length < 4 ? "25%" :
                                                            passwordValue.length < 6 ? "50%" :
                                                                passwordValue.length < 8 ? "75%" : "100%"
                                                }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium text-gray-700">Requirements</span>
                                        <div className="grid grid-cols-2 gap-2">
                                            {requirements.map((req) => (
                                                <div
                                                    key={req.label}
                                                    className={`flex items-center gap-2 text-xs ${req.valid ? "text-green-600" : "text-gray-500"
                                                        }`}
                                                >
                                                    {req.valid ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-gray-400" />
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <span className="text-xs">{req.icon}</span>
                                                        {req.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="h-12 text-base pr-12"
                                    {...register("confirmPassword")}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 " /> : <Eye className="h-5 w-5" />}
                                </button>
                                {confirmPasswordValid && (
                                    <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={loading || !isValid || !allRequirementsMet}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
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
                        Already have an account?{" "}
                        <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Register;