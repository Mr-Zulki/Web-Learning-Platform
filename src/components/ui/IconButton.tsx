import React from "react";
import { ButtonVariant } from "./Button";
import { Spinner } from "./Spinner";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 rounded-lg text-sm",
  md: "w-9 h-9 rounded-xl text-base",
  lg: "w-11 h-11 rounded-xl text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#3D52A0] hover:bg-[#7091E6] active:bg-[#324484] text-[#EDE8F5] shadow-md shadow-[#3D52A0]/25 border border-white/20",
  secondary:
    "glass-panel text-[var(--canvas-text)] hover:bg-white/15 active:bg-white/5 border-[var(--border-glass)]",
  outline:
    "border border-[var(--border-glass-strong)] hover:border-[#7091E6] hover:bg-white/10 text-[var(--canvas-text)] active:bg-white/5",
  ghost:
    "text-[var(--canvas-text-secondary)] hover:text-[var(--canvas-text)] hover:bg-white/10 active:bg-white/5 border-transparent",
  danger:
    "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border border-red-400/30",
  success:
    "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border border-emerald-400/30",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      "aria-label": ariaLabel,
      variant = "ghost",
      size = "md",
      isLoading = false,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === "sm" ? "sm" : "md"} label={ariaLabel} />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
