"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const { completedLessonIds } = useUserProgress();
  const currentLesson = lessons.find((l) => l.id === currentLessonId);

  return (
    <aside className="mb-4 w-full xl:mb-0 xl:w-60 xl:shrink-0">
      {/* Collapse Toggle Bar */}
      <div className="glass-panel rounded-xl border border-[var(--border-glass)] p-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="lesson-sidebar-list"
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-[var(--canvas-text)] transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#3D52A0] focus-visible:outline-none"
        >
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="h-4 w-4 shrink-0 text-[#7091E6]" />
            <span className="truncate">
              {currentLesson
                ? `${currentLesson.order}. ${currentLesson.title}`
                : "Select Lesson"}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-[var(--canvas-text-secondary)]">
            <span>{isOpen ? "Hide curriculum" : "All lessons"}</span>
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        </button>

        {/* Navigation List */}
        {isOpen && (
          <nav
            id="lesson-sidebar-list"
            aria-label="Lessons sidebar"
            className="mt-2 max-h-80 space-y-1 overflow-y-auto border-t border-[var(--border-glass)] pt-2"
          >
            <ul className="space-y-1">
              {lessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessonIds.has(lesson.id);
                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/lessons/${lesson.id}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs transition ${
                        isActive
                          ? "bg-[#3D52A0] font-semibold text-[#EDE8F5] shadow-md shadow-[#3D52A0]/20"
                          : "text-[var(--canvas-text-secondary)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 font-mono text-[10px] font-bold text-[var(--canvas-text)] dark:bg-black/40">
                          {lesson.order}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      {isCompleted && (
                        <CheckCircle2
                          aria-label="Completed"
                          className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </aside>
  );
}
