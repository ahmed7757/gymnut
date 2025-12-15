'use client';

import { memo, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { CheckCircle } from 'lucide-react';

interface InputWithValidationProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasValue: boolean;
    hasError: boolean;
    showCheckIcon?: boolean;
}

export const InputWithValidation = memo(forwardRef<HTMLInputElement, InputWithValidationProps>(
    function InputWithValidation({ hasValue, hasError, showCheckIcon = true, className, ...props }, ref) {
        return (
            <div className="relative">
                <Input ref={ref} className={className} {...props} />
                {hasValue && !hasError && showCheckIcon && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                )}
            </div>
        );
    }
));
