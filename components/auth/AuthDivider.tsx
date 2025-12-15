interface AuthDividerProps {
    text?: string;
    className?: string;
}

export function AuthDivider({
    text = "Or continue with",
    className = ""
}: AuthDividerProps) {
    return (
        <div className={`relative my-8 ${className}`}>
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-gray-500 font-medium">
                    {text}
                </span>
            </div>
        </div>
    );
}
