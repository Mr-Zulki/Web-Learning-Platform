import React from "react";

export type BadgeVariant =
  "neutral" | "primary" | "success" | "warning" | "error";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  neutral: {
    badge: "bg-slate-800/80 text-slate-300 border-white/10",
    dot: "bg-slate-400",
  },
  primary: {
    badge: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    dot: "bg-blue-400",
  },
  success: {
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    dot: "bg-amber-400",
  },
  error: {
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    dot: "bg-red-400",
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm select-none ${styles.badge} ${className}`}
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
