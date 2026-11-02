import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />,
  error: <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />,
  info: <Info className="h-5 w-5 shrink-0 text-[#7091E6]" />,
};

const borderClasses: Record<ToastType, string> = {
  success: "border-emerald-500/40 shadow-emerald-500/15",
  error: "border-red-500/40 shadow-red-500/15",
  info: "border-[#7091E6]/40 shadow-[#7091E6]/15",
};

export function Toast({
  type = "info",
  title,
  message,
  onClose,
  className = "",
}: ToastProps) {
  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`glass-panel-elevated flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-2xl ${borderClasses[type]} ${className}`}
    >
      {icons[type]}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold text-[var(--canvas-text)]">{title}</h4>
        {message && (
          <p className="mt-1 text-xs text-[var(--canvas-text-secondary)]">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1 text-[var(--canvas-text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--canvas-text)]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
