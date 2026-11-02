"use client";

import React, { useState } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const posClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-50 rounded-xl border border-white/20 bg-[#0E1328] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#EDE8F5] shadow-xl backdrop-blur-md transition-opacity duration-150 ${posClasses[position]}`}
        >
          {content}
        </div>
      )}
    </div>
  );
}
