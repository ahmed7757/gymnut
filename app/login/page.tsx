// app/login/page.tsx
"use client";

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
import { Loader2, Apple, XCircle, Zap, Target } from "lucide-react";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import { useLoginStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { FormInput, ErrorMessage } from "@/components/ui/FormInput";

const Login = () => {
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

  const {
    handleAuthError,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    router,
  } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await handleCredentialsSignIn(email, password);
      router.replace("/");
    } catch (err: any) {
      setError(handleAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl rounded-3xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 text-green-600">
              <Apple className="h-8 w-8" />
              <Zap className="h-6 w-6 text-emerald-500" />
              <Target className="h-6 w-6 text-green-700" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent">
              Gym Nutrition
            </h1>
            <p className="text-sm text-green-600 font-medium mt-1">
              Fuel Your Fitness Journey
            </p>
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Welcome back, Champion!
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Ready to crush your nutrition goals? 💪
          </CardDescription>
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

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-200"
                required
              />
            </div>

            {/* Password */}
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
                value={password}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-2 focus:ring-green-500 focus:border-green-500 border-gray-200"
                required
              />
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
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
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
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Start Your Journey
                </div>
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
            className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 hover:border-green-300 hover:bg-green-50 transition-colors rounded-xl bg-transparent"
            onClick={handleGoogleSignIn}
          >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-gray-600">
            New to your fitness journey?{" "}
            <Link
              href="/register"
              className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors"
            >
              Join the community
            </Link>
          </p>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 italic">
              "Transform your body, fuel your dreams" 🌱
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
