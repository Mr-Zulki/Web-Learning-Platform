export default function LessonsLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-4 h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mb-8 h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-48 rounded-lg border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-900"
          />
        ))}
      </div>
    </div>
  );
}
