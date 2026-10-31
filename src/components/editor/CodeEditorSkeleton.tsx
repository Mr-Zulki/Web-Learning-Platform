export function CodeEditorSkeleton() {
  return (
    <div
      aria-label="Loading code editor"
      className="flex h-[300px] w-full flex-col justify-between rounded-b-lg bg-[#282c34] p-4 font-mono text-xs text-slate-400"
    >
      <div className="animate-pulse space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-5 text-right text-slate-600">1</span>
          <div className="h-3.5 w-1/3 rounded bg-slate-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right text-slate-600">2</span>
          <div className="h-3.5 w-1/2 rounded bg-slate-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right text-slate-600">3</span>
          <div className="h-3.5 w-1/4 rounded bg-slate-700" />
        </div>
        <div className="flex items-center gap-3">
          <span className="w-5 text-right text-slate-600">4</span>
          <div className="h-3.5 w-2/3 rounded bg-slate-700" />
        </div>
      </div>
      <div className="text-right text-[11px] text-slate-500">
        Loading editor...
      </div>
    </div>
  );
}
