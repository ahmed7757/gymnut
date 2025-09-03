// app/register/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Dumbbell, XCircle } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { useRegisterStore } from "@/stores/authStore";
import { useAuth, usePasswordStrength } from "@/hooks/useAuth";
import { FormInput, ErrorMessage } from "@/components/ui/FormInput";
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
    confirmPasswordValue && confirmPasswordValue === passwordValue;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="flex items-center justify-center gap-3 text-green-600">
            <Dumbbell className="h-10 w-10" />
            <h1 className="text-3xl font-bold">GymNut</h1>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Start your fitness journey today
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
            {/* Form fields remain the same */}
            {/* ... */}

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

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
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
