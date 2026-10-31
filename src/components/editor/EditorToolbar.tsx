"use client";

import { useState } from "react";
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
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="rounded px-2.5 py-1 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          title="Reset to starter code"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="rounded px-2.5 py-1 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          title={`Copy ${activeTab.toUpperCase()} code to clipboard`}
        >
          {copied ? "Copied!" : "Copy code"}
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
