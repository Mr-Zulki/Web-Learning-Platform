export default function LessonsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-4 h-8 w-48 rounded-xl bg-black/10 dark:bg-white/10" />
      <div className="mb-8 h-4 w-96 rounded-lg bg-black/10 dark:bg-white/10" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="glass-panel h-52 rounded-2xl border border-[var(--border-glass)] p-6"
          />
        ))}
      </div>
    </div>
  );
}
