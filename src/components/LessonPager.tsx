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
      className="mt-6 flex flex-col items-stretch justify-between gap-3 border-t border-surface-variant/40 pt-4 sm:flex-row sm:items-center"
    >
      {prev ? (
        <Link
          href={`/lessons/${prev.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-surface-variant/60 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-on-surface shadow-sm transition hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>
            Previous: <span className="font-normal text-on-surface-variant">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/lessons/${next.id}`}
          className="inline-flex items-center justify-end gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-container"
        >
          <span>
            Next: <span className="font-normal opacity-90">{next.title}</span>
          </span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
