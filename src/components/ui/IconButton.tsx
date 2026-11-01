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
  sm: "w-8 h-8 rounded-md text-sm",
  md: "w-9 h-9 rounded-lg text-base",
  lg: "w-11 h-11 rounded-xl text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md shadow-blue-500/20 border border-blue-400/30",
  secondary:
    "glass-panel text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/5 border-white/10",
  outline:
    "border border-white/20 hover:border-white/40 hover:bg-white/5 text-slate-200 active:bg-white/10",
  ghost:
    "text-slate-400 hover:text-slate-100 hover:bg-white/10 active:bg-white/5 border-transparent",
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
        className={`inline-flex items-center justify-center transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
