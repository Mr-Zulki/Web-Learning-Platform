import React from "react";

export type BadgeVariant =
  "neutral" | "primary" | "success" | "warning" | "error";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  neutral: {
    badge: "bg-[#8697C4]/15 text-[var(--canvas-text)] border-[#8697C4]/30",
    dot: "bg-[#8697C4]",
  },
  primary: {
    badge:
      "bg-[#3D52A0]/15 text-[#3D52A0] dark:text-[#ADBBDA] border-[#7091E6]/40",
    dot: "bg-[#7091E6]",
  },
  success: {
    badge:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  warning: {
    badge:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
  },
  error: {
    badge: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
    dot: "bg-red-500",
  },
};

export function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm select-none ${styles.badge} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 animate-pulse rounded-full ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
