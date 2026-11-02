import React from "react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className = "", ...props }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--canvas-text)] shadow-inner select-none dark:bg-black/40 ${className}`}
      {...props}
    >
      {children}
    </kbd>
  );
}
