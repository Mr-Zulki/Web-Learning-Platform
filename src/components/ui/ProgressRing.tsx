import React from "react";

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "primary" | "success" | "warning";
  children?: React.ReactNode;
}

const colorMap = {
  primary: "text-blue-500",
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
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progress: ${percentage}%`}
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
          className="text-slate-800"
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
          <span className="text-xl font-bold tracking-tight text-slate-100">
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
