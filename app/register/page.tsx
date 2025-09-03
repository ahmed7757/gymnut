"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Loader2,
  Apple,
  Zap,
  Target,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { useRegisterStore } from "@/stores/authStore";
import { useAuth, usePasswordStrength } from "@/hooks/useAuth";
import { registerSchema } from "@/lib/schemas";

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
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
    handleAuthError,
    handleGoogleSignIn,
    handleRegister,
    handleCredentialsSignIn,
    router,
  } = useAuth();
  const { getPasswordStrength, getPasswordRequirements } =
    usePasswordStrength();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword");

  const strength = getPasswordStrength(passwordValue);
  const requirements = getPasswordRequirements(passwordValue);
  const allRequirementsMet = requirements.every((r) => r.valid);
  const confirmPasswordValid =
    !!confirmPasswordValue &&
    confirmPasswordValue === passwordValue &&
    !errors.confirmPassword;

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setFormError(null);
      await handleRegister(data);
      await handleCredentialsSignIn(data.email, data.password);
      router.replace("/");
    } catch (err: any) {
      setFormError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const renderInputWithCheck = (
    id: string,
    props: any,
    value: string,
    error?: string
  ) => (
    <div className="relative">
      <Input id={id} {...props} />
      {value && !error && (
        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-teal-200/25 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-10 w-16 h-16 bg-green-300/30 rounded-full blur-lg animate-pulse delay-700"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4 pb-6 pt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <Apple className="h-8 w-8" />
              <Zap className="h-6 w-6" />
              <Target className="h-7 w-7" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Gym Nutrition
            </h1>
            <p className="text-sm text-emerald-600/80 font-medium mt-1">
              Fuel Your Fitness Journey
            </p>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Start your transformation today with personalized nutrition plans
          </CardDescription>
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
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-gray-700"
              >
                Full Name
              </Label>
              {renderInputWithCheck(
                "name",
                {
                  placeholder: "Enter your full name",
                  className:
                    "h-12 text-base border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20",
                  ...register("name"),
                },
                nameValue || "",
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
              <Label
                htmlFor="gender"
                className="text-sm font-semibold text-gray-700"
              >
                Gender
              </Label>
              <select
                id="gender"
                {...register("gender")}
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

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email Address
              </Label>
              {renderInputWithCheck(
                "email",
                {
                  type: "email",
                  placeholder: "name@example.com",
                  className:
                    "h-12 text-base border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20",
                  ...register("email"),
                },
                emailValue || "",
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
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-12 text-base pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  {...register("password")}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
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

              {passwordFocused && passwordValue && (
                <div className="space-y-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Password Strength
                      </span>
                      <span
                        className={`text-sm font-semibold ${strength.textColor}`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-2 ${strength.color} transition-all duration-300 ease-out`}
                        style={{
                          width:
                            passwordValue.length === 0
                              ? "0%"
                              : passwordValue.length < 4
                              ? "25%"
                              : passwordValue.length < 6
                              ? "50%"
                              : passwordValue.length < 8
                              ? "75%"
                              : "100%",
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-700">
                      Requirements
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {requirements.map((req) => (
                        <div
                          key={req.label}
                          className={`flex items-center gap-2 text-xs ${
                            req.valid ? "text-emerald-600" : "text-gray-500"
                          }`}
                        >
                          {req.valid ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
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
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-12 text-base pr-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 " />
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
                "Start Your Journey"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors bg-transparent"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
