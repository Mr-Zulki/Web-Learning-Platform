"use client";

import { useMemo, useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCw } from "lucide-react";
import { buildPreviewDocument } from "@/lib/preview";

interface PreviewFrameProps {
  html: string;
  css: string;
  className?: string;
}

type ViewportMode = "desktop" | "tablet" | "mobile";

export function PreviewFrame({ html, css, className = "" }: PreviewFrameProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  const { document: srcDoc, truncated } = useMemo(
    () => buildPreviewDocument({ html, css }),
    [html, css]
  );

  const viewportWidths = {
    desktop: "w-full",
    tablet: "w-[768px] max-w-full",
    mobile: "w-[375px] max-w-full",
  };

  return (
    <div
      className={`glass-panel metallic-top-edge flex h-full flex-col overflow-hidden rounded-2xl shadow-xl transition-all duration-200 ${className}`}
    >
      {/* Liquid Glass browser chrome */}
      <div className="flex items-center justify-between border-b border-[var(--border-glass)] bg-black/10 px-4 py-2.5 text-xs font-semibold text-[var(--canvas-text-secondary)] dark:bg-black/30">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-heading font-bold text-[var(--canvas-text)]">
            Live Preview
          </span>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-[var(--border-glass)] bg-white/10 p-0.5 dark:bg-black/30">
          <button
            type="button"
            aria-label="Desktop viewport"
            onClick={() => setViewport("desktop")}
            className={`rounded-lg p-1.5 transition-colors ${
              viewport === "desktop"
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-sm"
                : "text-[var(--canvas-text-muted)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Tablet viewport (768px)"
            onClick={() => setViewport("tablet")}
            className={`rounded-lg p-1.5 transition-colors ${
              viewport === "tablet"
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-sm"
                : "text-[var(--canvas-text-muted)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Mobile viewport (375px)"
            onClick={() => setViewport("mobile")}
            className={`rounded-lg p-1.5 transition-colors ${
              viewport === "mobile"
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-sm"
                : "text-[var(--canvas-text-muted)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {truncated && (
            <span className="text-[11px] font-bold text-amber-500 dark:text-amber-400">
              Truncated
            </span>
          )}
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-lg p-1.5 text-[var(--canvas-text-secondary)] transition-colors hover:bg-white/10 hover:text-[var(--canvas-text)]"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Frame canvas */}
      <div className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-auto bg-black/10 p-2 sm:p-4 dark:bg-black/35">
        <div
          className={`h-full overflow-hidden rounded-xl border border-white/20 bg-white shadow-2xl transition-all duration-200 ${viewportWidths[viewport]}`}
        >
          <iframe
            key={refreshKey}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            referrerPolicy="no-referrer"
            title="Live preview"
            loading="lazy"
            className="h-full min-h-[320px] w-full border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
