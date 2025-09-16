'use client';

import { CheckCircle } from 'lucide-react';

interface SuccessAlertProps {
    message: string;
    className?: string;
}

export function SuccessAlert({ message, className = "" }: SuccessAlertProps) {
    if (!message) return null;

    return (
        <div className={`mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200 ${className}`}>
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}
