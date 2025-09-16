'use client';

import { XCircle } from 'lucide-react';

interface ErrorAlertProps {
    error: string;
    className?: string;
}

export function ErrorAlert({ error, className = "" }: ErrorAlertProps) {
    if (!error) return null;

    return (
        <div className={`mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200 ${className}`}>
            <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="font-medium">{error}</span>
            </div>
        </div>
    );
}
