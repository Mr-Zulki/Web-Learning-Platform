import React from "react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Kbd({ children, className = "", ...props }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center justify-center rounded border border-white/10 bg-slate-800/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-slate-300 shadow-inner ${className}`}
      {...props}
    >
      {children}
    </kbd>
  );
}
