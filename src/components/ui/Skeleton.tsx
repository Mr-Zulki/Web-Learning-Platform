import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export function Skeleton({
  variant = "rectangular",
  className = "",
  ...props
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full rounded",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse border border-white/5 bg-slate-800/80 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
