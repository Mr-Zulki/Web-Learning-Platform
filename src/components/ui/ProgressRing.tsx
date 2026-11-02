import React from "react";

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "primary" | "success" | "warning";
  children?: React.ReactNode;
  "aria-hidden"?: boolean | "true" | "false";
}

const colorMap = {
  primary: "text-[#7091E6]",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "primary",
  children,
  className = "",
  "aria-hidden": ariaHidden,
  ...props
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((value / max) * 100))
  );
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      role={ariaHidden ? undefined : "progressbar"}
      aria-hidden={ariaHidden}
      aria-valuenow={ariaHidden ? undefined : value}
      aria-valuemin={ariaHidden ? undefined : 0}
      aria-valuemax={ariaHidden ? undefined : max}
      aria-label={ariaHidden ? undefined : `Progress: ${percentage}%`}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        {...props}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="text-black/15 dark:text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`transition-all duration-500 ease-out ${colorMap[variant]}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <span className="text-xl font-extrabold tracking-tight text-[var(--canvas-text)]">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
