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
      className={`glass-panel flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 shadow-xl ${className}`}
    >
      {/* Preview toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/60 px-4 py-2.5 text-xs font-semibold text-slate-300">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-medium text-slate-200">Live Preview</span>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/80 p-0.5">
          <button
            type="button"
            aria-label="Desktop viewport"
            onClick={() => setViewport("desktop")}
            className={`rounded-md p-1.5 transition-colors ${
              viewport === "desktop"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Tablet viewport (768px)"
            onClick={() => setViewport("tablet")}
            className={`rounded-md p-1.5 transition-colors ${
              viewport === "tablet"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Mobile viewport (375px)"
            onClick={() => setViewport("mobile")}
            className={`rounded-md p-1.5 transition-colors ${
              viewport === "mobile"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {truncated && (
            <span className="text-[11px] font-medium text-amber-400">
              Truncated
            </span>
          )}
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Frame canvas */}
      <div className="relative flex min-h-[320px] flex-1 items-center justify-center overflow-auto bg-slate-950/40 p-2 sm:p-4">
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
