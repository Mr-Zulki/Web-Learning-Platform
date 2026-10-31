"use client";

import { useMemo } from "react";
import { buildPreviewDocument } from "@/lib/preview";

interface PreviewFrameProps {
  html: string;
  css: string;
  className?: string;
}

export function PreviewFrame({ html, css, className = "" }: PreviewFrameProps) {
  const { document: srcDoc, truncated } = useMemo(
    () => buildPreviewDocument({ html, css }),
    [html, css]
  );

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Live Preview</span>
        </div>
        {truncated && (
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
            Truncated at 50,000 characters
          </span>
        )}
      </div>

      <div className="relative min-h-[320px] flex-1 bg-white">
        <iframe
          sandbox="allow-scripts"
          srcDoc={srcDoc}
          referrerPolicy="no-referrer"
          title="Live preview"
          loading="lazy"
          className="h-full w-full border-0 bg-white"
        />
      </div>
    </div>
  );
}
