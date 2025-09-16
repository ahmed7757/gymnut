'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    TrendingDown,
    Target,
    Calendar,
    Plus,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
    todayMeals: number;
    todayWorkouts: number;
    weeklyGoal: {
        meals: number;
        workouts: number;
    };
    weeklyProgress: {
        meals: number;
        workouts: number;
    };
    streak: number;
    lastActivity: string;
}

export function DashboardOverview() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Simulate API call - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - replace with actual data fetching
                setData({
                    todayMeals: 2,
                    todayWorkouts: 1,
                    weeklyGoal: { meals: 21, workouts: 5 },
                    weeklyProgress: { meals: 12, workouts: 3 },
                    streak: 7,
                    lastActivity: '2 hours ago'
                });
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        );
    }

    if (!data) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <p className="text-gray-500">Failed to load dashboard data</p>
                </div>
            </Card>
        );
    }

    const mealProgress = (data.weeklyProgress.meals / data.weeklyGoal.meals) * 100;
    const workoutProgress = (data.weeklyProgress.workouts / data.weeklyGoal.workouts) * 100;

    return (
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-lg">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Today's Overview</h2>
                <div className="flex items-center text-sm text-gray-500 bg-green-50/50 px-4 py-2 rounded-xl">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                    })}
                </div>
            </div>

            <div className="space-y-6">
                {/* Today's activities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-green-800">Meals Logged</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">{data.todayMeals}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-200/50 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-blue-800">Workouts Completed</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{data.todayWorkouts}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly progress */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Weekly Progress</h3>

                    <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-xl border border-green-100/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-700">Meals</span>
                                <span className="text-sm font-medium text-green-600">
                                    {data.weeklyProgress.meals} / {data.weeklyGoal.meals}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${Math.min(mealProgress, 100)}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-white/50 p-4 rounded-xl border border-blue-100/50">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-700">Workouts</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {data.weeklyProgress.workouts} / {data.weeklyGoal.workouts}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                    style={{ width: `${Math.min(workoutProgress, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="flex flex-wrap gap-4">
                    <Link href="/meals">
                        <Button className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                            <Plus className="h-4 w-4" />
                            <span>Log Meal</span>
                        </Button>
                    </Link>
                    <Link href="/workouts">
                        <Button variant="outline" className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                            <Plus className="h-4 w-4" />
                            <span>Log Workout</span>
                        </Button>
                    </Link>
                    <Link href="/progress">
                        <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-green-700 hover:bg-green-50/50 transition-all duration-200">
                            <span>View Progress</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
