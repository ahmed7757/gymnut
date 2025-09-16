import Link from 'next/link';

interface AuthLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function AuthLink({ href, children, className = "" }: AuthLinkProps) {
    return (
        <Link
            href={href}
            className={`text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors ${className}`}
        >
            {children}
        </Link>
    );
}
