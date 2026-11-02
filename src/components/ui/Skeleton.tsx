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
    text: "h-4 w-full rounded-lg",
    rectangular: "rounded-2xl",
    circular: "rounded-full",
  };

  return (
    <div
      aria-hidden="true"
      className={`animate-pulse border border-white/10 bg-black/10 dark:bg-white/10 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
