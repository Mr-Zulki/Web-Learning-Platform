import React from "react";

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "primary" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const colorMap = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-500",
  success: "bg-gradient-to-r from-emerald-500 to-teal-400",
  warning: "bg-gradient-to-r from-amber-500 to-orange-400",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = false,
  className = "",
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / max) * 100))
  );

  return (
    <div className={`w-full ${className}`} {...props}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${percentage}%`}
        className={`w-full overflow-hidden rounded-full border border-white/5 bg-slate-800/80 ${sizeMap[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorMap[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-medium text-slate-400">
          {percentage}%
        </div>
      )}
    </div>
  );
}
