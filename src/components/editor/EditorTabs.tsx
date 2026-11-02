"use client";

import { useRef, type KeyboardEvent } from "react";
import { FileCode2, Palette } from "lucide-react";

export type EditorTabType = "html" | "css";

interface EditorTabsProps {
  activeTab: EditorTabType;
  onTabChange: (tab: EditorTabType) => void;
}

export function EditorTabs({ activeTab, onTabChange }: EditorTabsProps) {
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
      className="flex items-center gap-1.5 border-b border-[var(--border-glass)] bg-black/10 px-3 pt-2 transition-colors duration-200 dark:bg-black/30"
    >
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
        className={`flex items-center gap-2 rounded-t-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none ${
          activeTab === "html"
            ? "border-t-2 border-[#7091E6] bg-white/10 text-[var(--canvas-text)] shadow-inner dark:bg-black/40"
            : "text-[var(--canvas-text-muted)] hover:bg-white/5 hover:text-[var(--canvas-text)]"
        }`}
      >
        <FileCode2 className="h-4 w-4 text-[#7091E6]" />
        <span>HTML</span>
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
        className={`flex items-center gap-2 rounded-t-xl px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all duration-150 focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none ${
          activeTab === "css"
            ? "border-t-2 border-[#ADBBDA] bg-white/10 text-[var(--canvas-text)] shadow-inner dark:bg-black/40"
            : "text-[var(--canvas-text-muted)] hover:bg-white/5 hover:text-[var(--canvas-text)]"
        }`}
      >
        <Palette className="h-4 w-4 text-[#ADBBDA]" />
        <span>CSS</span>
      </button>
    </div>
  );
}
