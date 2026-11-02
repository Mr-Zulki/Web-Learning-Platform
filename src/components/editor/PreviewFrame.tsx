"use client";

import { useMemo, useState } from "react";
import { buildPreviewDocument } from "@/lib/preview";

interface PreviewFrameProps {
  html: string;
  css: string;
  className?: string;
  lastResult?: {
    passed: boolean;
    score: { passed: number; total: number };
    results: Array<{ message: string; passed: boolean }>;
  } | null;
}

type ViewportMode = "desktop" | "tablet" | "mobile";

export function PreviewFrame({
  html,
  css,
  className = "",
  lastResult,
}: PreviewFrameProps) {
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
    <section
      aria-label="Live Preview Panel"
      className={`bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden h-full border border-surface-variant/40 ${className}`}
    >
      {/* Top Preview Chrome Bar */}
      <div className="px-space-md py-space-sm bg-surface-container-low flex items-center justify-between gap-space-sm border-b border-surface-variant/40">
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            aria-label="Reload preview"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"
            title="Reload preview"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
          </button>
          {truncated && (
            <span className="text-[11px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
              Truncated
            </span>
          )}
        </div>

        <div className="flex-1 max-w-xs flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-lowest shadow-sm text-outline font-label-code-sm text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
          <span className="truncate">localhost:3000/preview</span>
        </div>

        {/* Viewport switch controls */}
        <div className="flex items-center rounded-lg bg-surface-container p-0.5">
          <button
            type="button"
            id="view-desktop"
            aria-label="Desktop viewport"
            onClick={() => setViewport("desktop")}
            className={`p-1 rounded transition-colors ${
              viewport === "desktop"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-outline hover:text-on-surface"
            }`}
            title="Desktop view"
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
          </button>
          <button
            type="button"
            id="view-tablet"
            aria-label="Tablet viewport (768px)"
            onClick={() => setViewport("tablet")}
            className={`p-1 rounded transition-colors ${
              viewport === "tablet"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-outline hover:text-on-surface"
            }`}
            title="Tablet view"
          >
            <span className="material-symbols-outlined text-[16px]">tablet</span>
          </button>
          <button
            type="button"
            id="view-mobile"
            aria-label="Mobile viewport (375px)"
            onClick={() => setViewport("mobile")}
            className={`p-1 rounded transition-colors ${
              viewport === "mobile"
                ? "bg-surface-container-lowest text-primary shadow-sm"
                : "text-outline hover:text-on-surface"
            }`}
            title="Mobile view"
          >
            <span className="material-symbols-outlined text-[16px]">smartphone</span>
          </button>
        </div>
      </div>

      {/* Frame canvas */}
      <div className="flex-1 bg-surface-container-low/40 p-space-md overflow-y-auto flex flex-col items-center justify-center relative min-h-[300px]">
        <div
          className={`h-full min-h-[300px] overflow-hidden rounded-xl border border-surface-variant/40 bg-white shadow-md transition-all duration-200 ${viewportWidths[viewport]}`}
        >
          <iframe
            key={refreshKey}
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            referrerPolicy="no-referrer"
            title="Live preview"
            loading="lazy"
            className="h-full min-h-[300px] w-full border-0 bg-white"
          />
        </div>
      </div>

      {/* Bottom Test Output Console matching reference */}
      <div className="bg-surface-container-high p-space-sm flex flex-col gap-1 border-t border-surface-variant/40">
        <div className="flex items-center justify-between text-on-surface font-label-code-sm text-label-code-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
            <span className="font-semibold text-primary">Test Output Console</span>
          </div>
          <span className="text-outline text-[11px]">Runner: Jest CSS Test Engine</span>
        </div>
        <div className="px-space-sm py-1.5 rounded bg-surface-container-lowest text-on-surface-variant font-label-code-sm text-[12px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                lastResult?.passed ? "bg-emerald-500" : "bg-secondary"
              }`}
            />
            <span>
              {lastResult
                ? lastResult.passed
                  ? `[PASS] All ${lastResult.score.total} specifications validated successfully.`
                  : `[FAIL] ${lastResult.score.passed}/${lastResult.score.total} checks passed. Keep going!`
                : "Live sandbox attached. Ready to execute verification tests."}
            </span>
          </div>
          <span className="text-outline text-[11px]">12ms</span>
        </div>
      </div>
    </section>
  );
}
