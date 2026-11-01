"use client";

import React, { useRef } from "react";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel = "Tabs",
  className = "",
}: TabsProps) {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      const nextTab = tabs[nextIndex];
      if (nextTab) {
        onChange(nextTab.id);
        const el = tabRefs.current.get(nextTab.id);
        el?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`glass-panel inline-flex items-center gap-1 rounded-xl border-white/10 p-1 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.id, el);
              else tabRefs.current.delete(tab.id);
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`tabpanel-${tab.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
              isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge}
          </button>
        );
      })}
    </div>
  );
}
