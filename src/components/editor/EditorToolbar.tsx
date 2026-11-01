"use client";

import { useState } from "react";
import { RotateCcw, Copy, Check } from "lucide-react";
import type { EditorTabType } from "./EditorTabs";

interface EditorToolbarProps {
  activeTab: EditorTabType;
  currentLength: number;
  maxLength: number;
  isModified: boolean;
  onReset: () => void;
  onCopy: () => void;
}

export function EditorToolbar({
  activeTab,
  currentLength,
  maxLength,
  isModified,
  onReset,
  onCopy,
}: EditorToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleReset = () => {
    if (isModified) {
      const confirmed = window.confirm(
        "Reset code to original lesson starter? Any unsaved changes will be lost."
      );
      if (!confirmed) return;
    }
    onReset();
  };

  const isOverLimit = currentLength > maxLength;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-950/50 px-3.5 py-1.5 text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none"
          title="Reset to starter code"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none"
          title={`Copy ${activeTab.toUpperCase()} code to clipboard`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="font-semibold text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div
        className={`font-mono text-[11px] ${
          isOverLimit ? "font-bold text-red-400" : "text-slate-400"
        }`}
        aria-live="polite"
      >
        <span>{currentLength.toLocaleString()}</span> /{" "}
        <span>{maxLength.toLocaleString()}</span> chars
      </div>
    </div>
  );
}
