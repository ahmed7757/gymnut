'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Utensils,
    Dumbbell,
    Clock,
    ArrowRight,
    CheckCircle,
    Target
} from 'lucide-react';
import Link from 'next/link';

interface ActivityItem {
    id: string;
    type: 'meal' | 'workout';
    title: string;
    description: string;
    time: string;
    completed: boolean;
}

export function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentActivity = async () => {
            try {
                // Simulate API call - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 600));

                // Mock data - replace with actual data fetching
                setActivities([
                    {
                        id: '1',
                        type: 'meal',
                        title: 'Breakfast',
                        description: 'Oatmeal with berries and protein powder',
                        time: '2 hours ago',
                        completed: true
                    },
                    {
                        id: '2',
                        type: 'workout',
                        title: 'Morning Cardio',
                        description: '30 minutes on the treadmill',
                        time: '4 hours ago',
                        completed: true
                    },
                    {
                        id: '3',
                        type: 'meal',
                        title: 'Lunch',
                        description: 'Grilled chicken salad',
                        time: '6 hours ago',
                        completed: true
                    },
                    {
                        id: '4',
                        type: 'workout',
                        title: 'Strength Training',
                        description: 'Upper body workout - scheduled for 6 PM',
                        time: 'In 2 hours',
                        completed: false
                    },
                    {
                        id: '5',
                        type: 'meal',
                        title: 'Dinner',
                        description: 'Salmon with quinoa and vegetables',
                        time: 'In 4 hours',
                        completed: false
                    }
                ]);
            } catch (error) {
                console.error('Failed to fetch recent activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentActivity();
    }, []);

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
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

    const getActivityIcon = (type: string, completed: boolean) => {
        if (type === 'meal') {
            return <Utensils className={`h-4 w-4 ${completed ? 'text-green-600' : 'text-gray-400'}`} />;
        } else {
            return <Dumbbell className={`h-4 w-4 ${completed ? 'text-blue-600' : 'text-gray-400'}`} />;
        }
    };

    const getActivityColor = (type: string, completed: boolean) => {
        if (completed) {
            return type === 'meal' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
        } else {
            return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Recent Activity</h3>
                <Link href="/activity">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-green-700 hover:bg-green-50/50 transition-all duration-200">
                        <span>View All</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-12">
                        <Target className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                        <p className="text-gray-500 text-lg">No recent activity</p>
                        <p className="text-sm text-gray-400 mt-2">Start logging your meals and workouts!</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className={`flex items-center space-x-4 p-4 rounded-xl border ${getActivityColor(activity.type, activity.completed)} shadow-sm hover:shadow-md transition-shadow duration-200`}
                        >
                            <div className="flex-shrink-0">
                                {getActivityIcon(activity.type, activity.completed)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3">
                                    <p className={`text-sm font-semibold ${activity.completed ? 'text-gray-900' : 'text-gray-700'}`}>
                                        {activity.title}
                                    </p>
                                    {activity.completed && (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                    {activity.description}
                                </p>
                            </div>

                            <div className="flex-shrink-0 flex items-center space-x-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                    {activity.time}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Quick action buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/meals">
                    <Button size="sm" className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                        <Utensils className="h-4 w-4" />
                        <span>Log Meal</span>
                    </Button>
                </Link>
                <Link href="/workouts">
                    <Button size="sm" variant="outline" className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                        <Dumbbell className="h-4 w-4" />
                        <span>Log Workout</span>
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
