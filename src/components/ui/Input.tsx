import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { error = false, leftIcon, rightIcon, className = "", disabled, ...props },
    ref
  ) => {
    return (
      <div className="relative flex w-full items-center">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center justify-center text-[var(--canvas-text-muted)]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          className={`w-full rounded-xl border bg-white/15 px-3.5 py-2.5 text-sm text-[var(--canvas-text)] backdrop-blur-md transition-all duration-150 placeholder:text-[var(--canvas-text-muted)] focus-visible:border-[#7091E6] focus-visible:ring-2 focus-visible:ring-[#7091E6]/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black/30 ${
            leftIcon ? "pl-10" : ""
          } ${rightIcon ? "pr-10" : ""} ${
            error
              ? "border-red-500/80 focus-visible:border-red-500 focus-visible:ring-red-500/50"
              : "border-[var(--border-glass)] hover:border-[var(--border-glass-strong)]"
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 flex items-center justify-center text-[var(--canvas-text-muted)]">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
