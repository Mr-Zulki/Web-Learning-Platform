"use client";

import { useState } from "react";
import type { EditorTabType } from "./EditorTabs";

interface EditorToolbarProps {
  activeTab: EditorTabType;
  currentLength: number;
  maxLength: number;
  isModified: boolean;
  onReset?: () => void;
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
    if (onReset) onReset();
  };

  const isOverLimit = currentLength > maxLength;

  return (
    <div className="bg-[#0B0E19] px-space-md py-space-xs flex items-center justify-between text-[#7E8B9F] font-label-code-sm text-[11px] select-none border-t border-[#252D4A]">
      <div className="flex items-center gap-space-md">
        <span className="flex items-center gap-1 text-[#34D399]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
          Live Sync
        </span>
        <span className="hidden sm:inline">Spaces: 2</span>
        <span className="hidden sm:inline">UTF-8</span>
        {onReset && isModified && (
          <button
            type="button"
            onClick={handleReset}
            className="text-amber-400 hover:underline cursor-pointer"
            title="Reset code to original"
          >
            Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-space-sm">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="text-[#7E8B9F] hover:text-[#EDE8F5] transition-colors cursor-pointer flex items-center gap-1"
          title="Copy code"
        >
          {copied ? (
            <span className="text-[#34D399] font-bold">Copied!</span>
          ) : (
            <span className="material-symbols-outlined text-[14px]">content_copy</span>
          )}
        </button>
        <div
          className={`font-label-code-sm text-[11px] ${
            isOverLimit ? "font-bold text-red-400" : "text-[#7E8B9F]"
          }`}
          aria-live="polite"
        >
          <span>{currentLength.toLocaleString()}</span> /{" "}
          <span>{maxLength.toLocaleString()}</span>
        </div>
        <span className="text-secondary font-semibold uppercase">{activeTab}</span>
      </div>
    </div>
  );
}
