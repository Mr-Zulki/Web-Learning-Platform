"use client";

import { useRef, type KeyboardEvent } from "react";

export type EditorTabType = "html" | "css";

interface EditorTabsProps {
  activeTab: EditorTabType;
  onTabChange: (tab: EditorTabType) => void;
  onCopy?: () => void;
}

export function EditorTabs({ activeTab, onTabChange, onCopy }: EditorTabsProps) {
  const htmlTabRef = useRef<HTMLButtonElement>(null);
  const cssTabRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const nextTab: EditorTabType = activeTab === "html" ? "css" : "html";
      onTabChange(nextTab);
      if (nextTab === "html") {
        htmlTabRef.current?.focus();
      } else {
        cssTabRef.current?.focus();
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      onTabChange("html");
      htmlTabRef.current?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      onTabChange("css");
      cssTabRef.current?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Code Editor Tabs"
      className="bg-[#0D101C] px-space-md py-space-sm flex items-center justify-between select-none border-b border-[#252D4A]"
    >
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
        </div>
        <div className="flex items-center gap-1">
          <button
            ref={htmlTabRef}
            id="tab-html"
            role="tab"
            type="button"
            aria-selected={activeTab === "html"}
            aria-controls="panel-html"
            tabIndex={activeTab === "html" ? 0 : -1}
            onClick={() => onTabChange("html")}
            onKeyDown={handleKeyDown}
            className={`px-space-md py-1 rounded text-body-sm font-label-code-sm flex items-center gap-1 transition-colors ${
              activeTab === "html"
                ? "bg-[#1B2236] text-white shadow-sm font-semibold"
                : "text-[#8F9DBA] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#F97316]">html</span>
            <span>index.html</span>
            {activeTab === "html" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] ml-1" />
            )}
          </button>
          <button
            ref={cssTabRef}
            id="tab-css"
            role="tab"
            type="button"
            aria-selected={activeTab === "css"}
            aria-controls="panel-css"
            tabIndex={activeTab === "css" ? 0 : -1}
            onClick={() => onTabChange("css")}
            onKeyDown={handleKeyDown}
            className={`px-space-md py-1 rounded text-body-sm font-label-code-sm flex items-center gap-1 transition-colors ${
              activeTab === "css"
                ? "bg-[#1B2236] text-white shadow-sm font-semibold"
                : "text-[#8F9DBA] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#38BDF8]">css</span>
            <span>styles.css</span>
            {activeTab === "css" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] ml-1" />
            )}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[#8F9DBA]">
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="p-1 hover:text-white transition-colors"
            title="Copy Contents"
            aria-label="Copy editor contents"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
          </button>
        )}
      </div>
    </div>
  );
}
