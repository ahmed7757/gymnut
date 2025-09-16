'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import {
    Flame,
    Trophy,
    Clock,
    Target,
    TrendingUp,
    Calendar
} from 'lucide-react';

interface StatsData {
    currentStreak: number;
    longestStreak: number;
    totalWorkouts: number;
    totalMeals: number;
    averageWorkoutTime: number;
    goalCompletion: number;
}

export function DashboardStats() {
    const [data, setData] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Simulate API call - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data - replace with actual data fetching
                setData({
                    currentStreak: 7,
                    longestStreak: 21,
                    totalWorkouts: 45,
                    totalMeals: 128,
                    averageWorkoutTime: 45,
                    goalCompletion: 78
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
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
                    <p className="text-gray-500">Failed to load stats</p>
                </div>
            </Card>
        );
    }

    const stats = [
        {
            label: 'Current Streak',
            value: `${data.currentStreak} days`,
            icon: Flame,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            label: 'Longest Streak',
            value: `${data.longestStreak} days`,
            icon: Trophy,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        },
        {
            label: 'Total Workouts',
            value: data.totalWorkouts.toString(),
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Total Meals',
            value: data.totalMeals.toString(),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            label: 'Avg Workout Time',
            value: `${data.averageWorkoutTime} min`,
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            label: 'Goal Completion',
            value: `${data.goalCompletion}%`,
            icon: Calendar,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
        }
    ];

    return (
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-lg">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Your Stats</h3>

            <div className="space-y-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className={`flex items-center justify-between p-4 rounded-xl border ${stat.bgColor} ${stat.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-xl ${stat.bgColor} shadow-sm`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {stat.label}
                                </span>
                            </div>
                            <span className={`text-lg font-bold ${stat.color}`}>
                                {stat.value}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Achievement badge */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                        <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-800">Great Progress!</p>
                        <p className="text-xs text-green-600 mt-1">
                            You're on a {data.currentStreak}-day streak. Keep it up!
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
