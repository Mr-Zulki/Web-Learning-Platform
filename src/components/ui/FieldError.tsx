import React from "react";

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string | null;
}

export function FieldError({
  error,
  className = "",
  id,
  ...props
}: FieldErrorProps) {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      className={`mt-1.5 flex items-center gap-1 text-xs font-medium text-red-400 ${className}`}
      {...props}
    >
      <span aria-hidden="true">⚠</span>
      {error}
    </p>
  );
}
