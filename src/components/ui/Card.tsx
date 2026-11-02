import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "base" | "elevated" | "interactive";
  glow?: boolean;
}

export function Card({
  variant = "base",
  glow = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    base: "glass-panel rounded-2xl p-6",
    elevated: "glass-panel-elevated rounded-2xl p-6 shadow-xl",
    interactive:
      "glass-panel rounded-2xl p-6 transition-all duration-200 hover:border-[#7091E6] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7091E6]/15 cursor-pointer",
  };

  const glowStyle = glow
    ? "shadow-lg shadow-[#7091E6]/20 border-[#7091E6]/40"
    : "";

  return (
    <div
      className={`${variantStyles[variant]} ${glowStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mb-4 flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-lg font-bold tracking-tight text-[var(--canvas-text)] ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-sm text-[var(--canvas-text-secondary)] ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
