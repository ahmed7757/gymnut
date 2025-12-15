import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthErrorBoundary } from '@/components/auth/AuthErrorBoundary';

// Server-side metadata generation
export const metadata: Metadata = {
  title: 'Register - GymNut | AI-Powered Fitness & Nutrition Tracker',
  description: 'Join GymNut and start your fitness journey with personalized nutrition plans, workout routines, and AI-powered health recommendations.',
  keywords: ['register', 'signup', 'fitness', 'nutrition', 'gym', 'health', 'tracker', 'AI'],
  openGraph: {
    title: 'Register - GymNut',
    description: 'Start your fitness transformation today',
    type: 'website',
  },
  robots: {
    index: false, // Don't index registration pages
    follow: false,
  },
};

// Loading component for Suspense
function RegisterLoading() {
  return (
    <AuthLayout
      title="Create Your Account"
      description="Start your transformation today with personalized nutrition plans"
      className="from-emerald-50 via-green-50 to-teal-50"
    >
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
export default function RegisterPage() {
  return (
    <AuthErrorBoundary>
      <Suspense fallback={<RegisterLoading />}>
        <AuthLayout
          title="Create Your Account"
          description="Start your transformation today with personalized nutrition plans"
          className="from-emerald-50 via-green-50 to-teal-50"
        >
          <RegisterForm />
        </AuthLayout>
      </Suspense>
    </AuthErrorBoundary>
  );
}
