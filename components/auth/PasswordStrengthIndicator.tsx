'use client';

import { memo } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordRequirement {
    label: string;
    icon: string;
    valid: boolean;
}

interface PasswordStrengthIndicatorProps {
    password: string;
    requirements: PasswordRequirement[];
    strength: {
        label: string;
        color: string;
        textColor: string;
    };
    show: boolean;
}

export const PasswordStrengthIndicator = memo(function PasswordStrengthIndicator({
    password,
    requirements,
    strength,
    show,
}: PasswordStrengthIndicatorProps) {
    if (!show || !password) return null;

    return (
        <div className="space-y-3 p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                        Password Strength
                    </span>
                    <span className={`text-sm font-semibold ${strength.textColor}`}>
                        {strength.label}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-2 ${strength.color} transition-all duration-300 ease-out`}
                        style={{
                            width:
                                password.length === 0
                                    ? '0%'
                                    : password.length < 4
                                        ? '25%'
                                        : password.length < 6
                                            ? '50%'
                                            : password.length < 8
                                                ? '75%'
                                                : '100%',
                        }}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">
                    Requirements
                </span>
                <div className="grid grid-cols-2 gap-2">
                    {requirements.map((req) => (
                        <div
                            key={req.label}
                            className={`flex items-center gap-2 text-xs ${req.valid ? 'text-emerald-600' : 'text-gray-500'
                                }`}
                        >
                            {req.valid ? (
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="flex items-center gap-1">
                                <span className="text-xs">{req.icon}</span>
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});
