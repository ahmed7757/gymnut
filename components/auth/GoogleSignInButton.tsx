'use client';

import { Button } from '@/components/ui/button';
import { FaGoogle } from 'react-icons/fa6';

interface GoogleSignInButtonProps {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

export function GoogleSignInButton({
    onClick,
    disabled = false,
    className = ""
}: GoogleSignInButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={onClick}
            className={`w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 hover:border-green-300 hover:bg-green-50 transition-colors rounded-xl bg-transparent ${className}`}
        >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
        </Button>
    );
}
