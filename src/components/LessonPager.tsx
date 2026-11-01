import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Lesson } from "@/lib/lesson-schema";

interface LessonPagerProps {
  prev: Lesson | null;
  next: Lesson | null;
}

export function LessonPager({ prev, next }: LessonPagerProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="mt-8 flex flex-col items-stretch justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center"
    >
      {prev ? (
        <Link
          href={`/lessons/${prev.id}`}
          className="glass-panel inline-flex items-center gap-2 rounded-xl border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            Previous:{" "}
            <span className="font-normal text-slate-400">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={`/lessons/${next.id}`}
          className="inline-flex items-center justify-end gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:text-sm"
        >
          <span>
            Next:{" "}
            <span className="font-normal text-blue-100">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      ) : (
        <div aria-hidden="true" />
      )}
    </nav>
  );
}
