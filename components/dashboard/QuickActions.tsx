'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Target,
    Calendar,
    Settings,
    TrendingUp,
    Utensils,
    Dumbbell,
    BarChart3
} from 'lucide-react';
import Link from 'next/link';

const quickActions = [
    {
        title: 'Log Meal',
        description: 'Track your nutrition',
        icon: Utensils,
        href: '/meals',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        hoverColor: 'hover:bg-green-100'
    },
    {
        title: 'Log Workout',
        description: 'Record your exercise',
        icon: Dumbbell,
        href: '/workouts',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        hoverColor: 'hover:bg-blue-100'
    },
    {
        title: 'View Progress',
        description: 'Check your analytics',
        icon: BarChart3,
        href: '/progress',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        hoverColor: 'hover:bg-purple-100'
    },
    {
        title: 'Set Goals',
        description: 'Update your targets',
        icon: Target,
        href: '/settings/goals',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        hoverColor: 'hover:bg-orange-100'
    },
    {
        title: 'Schedule',
        description: 'Plan your week',
        icon: Calendar,
        href: '/schedule',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
        hoverColor: 'hover:bg-indigo-100'
    },
    {
        title: 'Settings',
        description: 'Manage preferences',
        icon: Settings,
        href: '/settings',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        hoverColor: 'hover:bg-gray-100'
    }
];

export function QuickActions() {
    return (
        <Card className="p-8 bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-lg">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">Quick Actions</h3>

            <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <Link key={index} href={action.href}>
                            <div className={`
                flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md
                ${action.bgColor} ${action.borderColor} ${action.hoverColor}
              `}>
                                <div className={`p-3 rounded-xl ${action.bgColor} shadow-sm`}>
                                    <Icon className={`h-5 w-5 ${action.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {action.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {action.description}
                                    </p>
                                </div>
                                <Plus className="h-4 w-4 text-gray-400" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Motivational quote */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-sm">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-green-800">Daily Motivation</p>
                        <p className="text-xs text-green-600 italic mt-1">
                            "The only bad workout is the one that didn't happen."
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
