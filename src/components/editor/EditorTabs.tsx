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
      className="flex items-center gap-1 border-b border-white/10 bg-slate-950/70 px-3 pt-2"
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
        className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
          activeTab === "html"
            ? "border-t-2 border-amber-400 bg-slate-900 text-amber-300 shadow-inner"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }`}
      >
        <FileCode2 className="h-3.5 w-3.5 text-amber-400" />
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
        className={`flex items-center gap-2 rounded-t-lg px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
          activeTab === "css"
            ? "border-t-2 border-blue-400 bg-slate-900 text-blue-300 shadow-inner"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }`}
      >
        <Palette className="h-3.5 w-3.5 text-blue-400" />
        <span>CSS</span>
      </button>
    </div>
  );
}
