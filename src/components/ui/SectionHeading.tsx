import React from "react";
import { Badge } from "./Badge";

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  badge,
  title,
  description,
  align = "left",
  className = "",
  ...props
}: SectionHeadingProps) {
  const alignClass =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      className={`flex flex-col gap-2 ${alignClass} ${className}`}
      {...props}
    >
      {badge && (
        <Badge variant="primary" dot>
          {badge}
        </Badge>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-sm text-slate-400 sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
