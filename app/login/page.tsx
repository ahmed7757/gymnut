import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';

// Server-side metadata generation
export const metadata: Metadata = {
  title: 'Login - GymNut | AI-Powered Fitness & Nutrition Tracker',
  description: 'Sign in to your GymNut account and continue your fitness journey with personalized nutrition plans and workout routines.',
  keywords: ['login', 'fitness', 'nutrition', 'gym', 'health', 'tracker'],
  openGraph: {
    title: 'Login - GymNut',
    description: 'Sign in to continue your fitness journey',
    type: 'website',
  },
  robots: {
    index: false, // Don't index login pages
    follow: false,
  },
};

// Loading component for Suspense
function LoginLoading() {
  return (
    <AuthLayout
      title="Welcome back, Champion!"
      description="Ready to crush your nutrition goals? 💪"
      subtitle="Loading your fitness journey..."
    >
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </AuthLayout>
  );
}

// Main server component
export default function LoginPage() {
  return (
    <AuthErrorBoundary>
      <Suspense fallback={<LoginLoading />}>
        <AuthLayout
          title="Welcome back, Champion!"
          description="Ready to crush your nutrition goals? 💪"
          subtitle="Transform your body, fuel your dreams 🌱"
        >
          <LoginForm />
        </AuthLayout>
      </Suspense>
    </AuthErrorBoundary>
  );
}
