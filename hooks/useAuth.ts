// hooks/useAuth.ts
import { useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import { PasswordStrength, PasswordRequirement } from "@/types";

export const useAuth = () => {
  const router = useRouter();

  const handleAuthError = useCallback((error: any): string => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    return error instanceof Error
      ? error.message
      : "An unexpected error occurred";
  }, []);

  const handleCredentialsSignIn = useCallback(
    async (email: string, password: string) => {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    []
  );

  const handleGoogleSignIn = useCallback(async () => {
    await signIn("google", { callbackUrl: "/" });
  }, []);

  const handleRegister = useCallback(async (userData: any) => {
    return await authService.register(userData);
  }, []);

  const handleForgotPassword = useCallback(async (email: string) => {
    return await authService.forgotPassword(email);
  }, []);

  const handleResetPassword = useCallback(
    async (token: string, newPassword: string) => {
      return await authService.resetPassword(token, newPassword);
    },
    []
  );

  return {
    handleAuthError,
    handleCredentialsSignIn,
    handleGoogleSignIn,
    handleRegister,
    handleForgotPassword,
    handleResetPassword,
    router,
  };
};

export const usePasswordStrength = () => {
  const getPasswordStrength = useCallback(
    (password: string): PasswordStrength => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^a-zA-Z0-9]/.test(password)) score++;

      switch (score) {
        case 0:
        case 1:
          return {
            label: "Weak",
            color: "bg-red-500",
            textColor: "text-red-600",
          };
        case 2:
          return {
            label: "Fair",
            color: "bg-orange-500",
            textColor: "text-orange-600",
          };
        case 3:
          return {
            label: "Good",
            color: "bg-blue-500",
            textColor: "text-blue-600",
          };
        case 4:
          return {
            label: "Strong",
            color: "bg-green-500",
            textColor: "text-green-600",
          };
        default:
          return {
            label: "",
            color: "bg-gray-200",
            textColor: "text-gray-400",
          };
      }
    },
    []
  );

  const getPasswordRequirements = useCallback(
    (password: string): PasswordRequirement[] => [
      {
        label: "At least 8 characters",
        valid: password.length >= 8,
        icon: "🔢",
      },
      {
        label: "One uppercase letter",
        valid: /[A-Z]/.test(password),
        icon: "🔠",
      },
      { label: "One number", valid: /[0-9]/.test(password), icon: "123" },
      {
        label: "One special character",
        valid: /[^a-zA-Z0-9]/.test(password),
        icon: "!@#",
      },
    ],
    []
  );

  return {
    getPasswordStrength,
    getPasswordRequirements,
  };
};
