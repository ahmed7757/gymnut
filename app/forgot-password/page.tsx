// app/forgot-password/page.tsx
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
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useForgotPasswordStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { FormInput, ErrorMessage } from "@/components/ui/FormInput";
import { forgotPasswordSchema } from "@/lib/schemas";

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const {
    email,
    error,
    isLoading,
    validEmail,
    success,
    emailFocus,
    setEmail,
    setError,
    setIsLoading,
    setValidEmail,
    setSuccess,
    setEmailFocus,
  } = useForgotPasswordStore();

  const { handleAuthError, handleForgotPassword } = useAuth();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setValue("email", value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(value));
  };

  const onSubmit = async (data: ForgotPasswordForm) => {
    if (!validEmail) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await handleForgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check your email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a password reset link to{" "}
              <span className="font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="link"
                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                onClick={() => setSuccess(false)}
              >
                try again
              </Button>
            </div>
            <div className="pt-4 border-t">
              <Link
                href="/login"
                className="block w-full text-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 text-red-400">⚠️</div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

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
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
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
                  "Send reset link"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
