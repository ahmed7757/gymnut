import { Suspense } from 'react';
import { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProtectedRoute } from '@/components/protected/ProtectedRoute';
import {
    DashboardOverview,
    DashboardStats,
    RecentActivity,
    QuickActions,
    DashboardLoading
} from '@/components/dashboard';
import { SessionDebug } from '@/components/debug/SessionDebug';

export const metadata: Metadata = {
    title: 'Dashboard | GymNut',
    description: 'Your fitness journey overview and progress tracking',
};

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="h-full flex flex-col space-y-8">
                    {/* Page header */}
                    <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl blur-3xl"></div>
                        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-green-100/50 shadow-lg">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="mt-3 text-lg text-gray-600">
                                Welcome back! Here's your fitness journey overview.
                            </p>
                        </div>
                    </div>

                    {/* Dashboard content with Suspense for optimal loading */}
                    <div className="flex-1 overflow-y-auto">
                        <Suspense fallback={<DashboardLoading />}>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                                {/* Main content area */}
                                <div className="lg:col-span-2 space-y-8">
                                    <DashboardOverview />
                                    <RecentActivity />
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-8">
                                    <DashboardStats />
                                    <QuickActions />
                                </div>
                            </div>
                        </Suspense>
                    </div>
                </div>
                <SessionDebug />
            </DashboardLayout>
        </ProtectedRoute>
    );
}
