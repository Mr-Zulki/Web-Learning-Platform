import Link from "next/link";
import type { Lesson } from "@/lib/lesson-schema";

interface LessonPagerProps {
  prev: Lesson | null;
  next: Lesson | null;
}

export function LessonPager({ prev, next }: LessonPagerProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-12 flex flex-col items-stretch justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center dark:border-slate-800"
    >
      {prev ? (
        <Link
          href={`/lessons/${prev.id}`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <span aria-hidden="true">←</span>
          <span>
            Previous: <span className="font-normal">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/lessons/${next.id}`}
          className="inline-flex items-center justify-end gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <span>
            Next: <span className="font-normal">{next.title}</span>
          </span>
          <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
