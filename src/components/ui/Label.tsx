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
      className={`mb-1.5 block text-xs font-semibold tracking-wider text-slate-300 uppercase select-none ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-400" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
