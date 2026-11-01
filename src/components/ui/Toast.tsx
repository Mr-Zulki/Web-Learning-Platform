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
  info: <Info className="h-5 w-5 shrink-0 text-blue-400" />,
};

const borderClasses: Record<ToastType, string> = {
  success: "border-emerald-500/30 shadow-emerald-500/10",
  error: "border-red-500/30 shadow-red-500/10",
  info: "border-blue-500/30 shadow-blue-500/10",
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
      className={`glass-panel-elevated flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl ${borderClasses[type]} ${className}`}
    >
      {icons[type]}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-slate-100">{title}</h4>
        {message && <p className="mt-1 text-xs text-slate-400">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
