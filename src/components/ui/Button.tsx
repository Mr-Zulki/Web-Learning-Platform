import React from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30",
  secondary:
    "glass-panel text-slate-100 hover:bg-white/10 active:bg-white/5 border-white/10",
  outline:
    "border border-white/20 hover:border-white/40 hover:bg-white/5 text-slate-200 active:bg-white/10",
  ghost:
    "text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/5 border-transparent",
  danger:
    "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-500/20 border border-red-400/30",
  success:
    "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2 rounded-lg gap-2",
  lg: "text-base px-5 py-2.5 rounded-xl gap-2.5 font-medium",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size={size === "sm" ? "sm" : "md"}
            className="text-current"
          />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
