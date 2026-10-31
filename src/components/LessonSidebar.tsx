"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lesson } from "@/lib/lesson-schema";
import { useUserProgress } from "@/lib/use-user-progress";

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
}

export function LessonSidebar({
  lessons,
  currentLessonId,
}: LessonSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { completedLessonIds } = useUserProgress();
  const currentLesson = lessons.find((l) => l.id === currentLessonId);

  return (
    <aside className="w-full md:w-64 md:shrink-0">
      {/* Mobile Collapse Bar */}
      <div className="border-b border-slate-200 bg-slate-50 p-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="lesson-sidebar-list"
          className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <span className="truncate">
            {currentLesson
              ? `${currentLesson.order}. ${currentLesson.title}`
              : "Select Lesson"}
          </span>
          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
            {mobileOpen ? "▲ Close" : "▼ All Lessons"}
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav
        id="lesson-sidebar-list"
        aria-label="Lessons sidebar"
        className={`${
          mobileOpen ? "block" : "hidden"
        } sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto p-4 md:block md:p-0`}
      >
        <h2 className="mb-3 hidden px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase md:block dark:text-slate-400">
          Curriculum
        </h2>
        <ul className="space-y-1">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentLessonId;
            const isCompleted = completedLessonIds.has(lesson.id);
            return (
              <li key={lesson.id}>
                <Link
                  href={`/lessons/${lesson.id}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-start justify-between gap-2.5 rounded-lg px-3 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    isActive
                      ? "border-l-4 border-blue-600 bg-blue-50 font-semibold text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {lesson.order}
                    </span>
                    <span className="truncate leading-snug">
                      {lesson.title}
                    </span>
                  </div>
                  {isCompleted && (
                    <span
                      aria-label="Completed"
                      className="ml-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      ✓
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
