import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '@/components/auth/ForgotPasswordSuccess';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';
import { ForgotPasswordClientWrapper } from '@/components/auth/ForgotPasswordClientWrapper';

// Server-side metadata generation
export const metadata: Metadata = {
  title: 'Forgot Password - GymNut | AI-Powered Fitness & Nutrition Tracker',
  description: 'Reset your GymNut password. Enter your email address and we\'ll send you a secure link to reset your password.',
  keywords: ['forgot password', 'reset password', 'fitness', 'nutrition', 'gym', 'health', 'tracker'],
  openGraph: {
    title: 'Forgot Password - GymNut',
    description: 'Reset your password securely',
    type: 'website',
  },
  robots: {
    index: false, // Don't index password reset pages
    follow: false,
  },
};

// Loading component for Suspense
function ForgotPasswordLoading() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email address associated with your account and we'll send you a link to reset your password."
      className="from-slate-50 to-gray-100"
    >
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </AuthLayout>
  );
}

// Main server component
export default function ForgotPasswordPage() {
  return (
    <AuthErrorBoundary>
      <Suspense fallback={<ForgotPasswordLoading />}>
        <AuthLayout
          title="Reset your password"
          description="Enter the email address associated with your account and we'll send you a link to reset your password."
          className="from-slate-50 to-gray-100"
        >
          <ForgotPasswordClientWrapper />
        </AuthLayout>
      </Suspense>
    </AuthErrorBoundary>
  );
}
