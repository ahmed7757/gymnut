'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Utensils,
    Dumbbell,
    TrendingUp,
    Settings,
    User,
    Menu,
    X,
    LogOut,
    Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meals', href: '/meals', icon: Utensils },
    { name: 'Workouts', href: '/workouts', icon: Dumbbell },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Add keyboard shortcut for sign out (Ctrl/Cmd + Shift + Q)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Q') {
                event.preventDefault();
                handleSignOut();
            }
        };

        if (isMounted) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isMounted]);

    const handleSignOut = async () => {
        // Show confirmation dialog
        const confirmed = window.confirm('Are you sure you want to sign out?');
        if (!confirmed) return;

        try {
            setIsSigningOut(true);
            toast.loading('Signing out...', { id: 'signout' });

            await signOut({
                callbackUrl: '/',
                redirect: true
            });

            toast.success('Successfully signed out!', { id: 'signout' });
        } catch (error) {
            console.error('Sign out error:', error);
            toast.error('Failed to sign out. Please try again.', { id: 'signout' });
            // Reset loading state on error
            setIsSigningOut(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 relative overflow-hidden flex">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            {/* Mobile sidebar overlay */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )
            }

            {/* Sidebar */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-green-100/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex items-center justify-between h-20 px-6 border-b border-green-100/50">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">GN</span>
                        </div>
                        <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">GymNut</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-green-50/50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User info */}
                <div className="px-6 py-6 border-b border-green-100/50">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-semibold text-lg">
                                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-semibold text-gray-900">
                                {session?.user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {session?.user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`
                      group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                      ${isActive
                                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm border border-green-200/50'
                                                : 'text-gray-700 hover:bg-green-50/50 hover:text-green-700 hover:shadow-sm'
                                            }
                    `}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <Icon className={`
                      mr-4 h-5 w-5 transition-colors duration-200
                      ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'}
                    `} />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Sign out button */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-green-100/50">
                    <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        disabled={isSigningOut}
                        title="Sign out (Ctrl/Cmd + Shift + Q)"
                        className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50/50 rounded-xl py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isSigningOut ? (
                            <>
                                <div className="mr-4 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                                Signing out...
                            </>
                        ) : (
                            <>
                                <LogOut className="mr-4 h-5 w-5" />
                                Sign out
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <div className="flex-shrink-0 bg-white/80 backdrop-blur-xl shadow-sm border-b border-green-100/50">
                    <div className="flex items-center justify-between h-20 px-6 lg:px-8">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-green-50/50 transition-colors"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="flex items-center space-x-4">
                            <button className="p-3 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-green-50/50 transition-colors relative">
                                <Bell className="h-6 w-6" />
                                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-semibold text-sm">
                                        {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {session?.user?.name || 'User'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="py-8 h-full">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div >
    );
}
