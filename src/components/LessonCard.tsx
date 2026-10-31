"use client";

import Link from "next/link";
import type { Lesson } from "@/lib/lesson-schema";
import { useUserProgress } from "@/lib/use-user-progress";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { completedLessonIds } = useUserProgress();
  const isCompleted = completedLessonIds.has(lesson.id);

  return (
    <article className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-xs transition hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500">
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            Lesson {lesson.order}
          </span>
          {isCompleted && (
            <span
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              aria-label="Lesson completed"
            >
              <span aria-hidden="true">✓</span> Completed
            </span>
          )}
        </div>
        <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          <Link
            href={`/lessons/${lesson.id}`}
            className="focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {lesson.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {lesson.summary}
        </p>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800/80">
        <Link
          href={`/lessons/${lesson.id}`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 transition group-hover:translate-x-0.5 dark:text-blue-400"
          aria-label={`Start lesson: ${lesson.title}`}
        >
          {isCompleted ? "Review lesson" : "Start lesson"}{" "}
          <span aria-hidden="true" className="ml-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
