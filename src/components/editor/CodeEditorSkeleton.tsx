export function CodeEditorSkeleton() {
  return (
    <div
      aria-label="Loading code editor"
      className="flex h-[300px] w-full flex-col justify-between rounded-b-xl border border-[var(--border-glass)] bg-[#0E1328] p-4 font-mono text-xs text-[var(--canvas-text-muted)]"
    >
      <div className="animate-pulse space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-5 text-right opacity-40">1</span>
          <div className="h-3.5 w-1/3 rounded bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right opacity-40">2</span>
          <div className="h-3.5 w-1/2 rounded bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right opacity-40">3</span>
          <div className="h-3.5 w-1/4 rounded bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right opacity-40">4</span>
          <div className="h-3.5 w-2/3 rounded bg-white/10" />
        </div>
      </div>
      <div className="text-right text-[11px] opacity-60">Loading editor...</div>
    </div>
  );
}
