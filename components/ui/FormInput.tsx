// components/ui/FormInput.tsx
import * as React from "react";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name?: string;
  error?: string;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      name,
      type = "text",
      placeholder,
      value,
      error,
      showPassword,
      onTogglePassword,
      onChange,
      onFocus,
      onBlur,
      className,
      required,
      ...rest
    },
    ref
  ) => {
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={cn("h-12 text-base pr-12", className)}
          aria-invalid={error ? "true" : "false"}
          required={required}
          ref={ref}
          {...rest}
        />

        {isPassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {typeof value === "string" && value && !error && (
          <CheckCircle className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
        )}

        {typeof value === "string" && error && value && (
          <XCircle className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
      <XCircle className="h-4 w-4" />
      {message}
    </p>
  );
};
