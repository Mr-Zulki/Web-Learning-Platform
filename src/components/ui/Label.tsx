import React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  required = false,
  className = "",
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={`mb-1.5 block text-xs font-bold tracking-wider text-[var(--canvas-text-secondary)] uppercase select-none ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-1 text-red-500 dark:text-red-400"
          aria-hidden="true"
        >
          *
        </span>
      )}
    </label>
  );
}
