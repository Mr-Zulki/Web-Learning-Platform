"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";
import type { Lesson } from "@/lib/lesson-schema";
import { useUserProgress } from "@/lib/use-user-progress";
import { Badge } from "./ui/Badge";

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const { completedLessonIds } = useUserProgress();
  const isCompleted = completedLessonIds.has(lesson.id);

  const wordCount = lesson.body.trim().split(/\s+/).length;
  const readingTime = Math.max(2, Math.ceil(wordCount / 150));

  return (
    <article className="group glass-panel metallic-top-edge relative flex flex-col justify-between rounded-2xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:border-[#7091E6]/50 hover:shadow-2xl hover:shadow-[#7091E6]/15">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" dot={!isCompleted}>
            Lesson {lesson.order}
          </Badge>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs font-medium text-[var(--canvas-text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}m
            </span>
            {isCompleted && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 dark:text-emerald-400"
                aria-label="Lesson completed"
              >
                <CheckCircle2 className="h-4 w-4" />
                Completed
              </span>
            )}
          </div>
        </div>

        <h2 className="font-heading mt-4 text-xl font-bold tracking-tight text-[var(--canvas-text)] transition-colors group-hover:text-[#7091E6]">
          <Link
            href={`/lessons/${lesson.id}`}
            className="focus-visible:rounded-xl focus-visible:ring-2 focus-visible:ring-[#7091E6] focus-visible:outline-none"
          >
            {lesson.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
          {lesson.summary}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <Link
          href={`/lessons/${lesson.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#7091E6] transition hover:text-[#ADBBDA]"
          aria-label={`Start lesson: ${lesson.title}`}
        >
          <span>{isCompleted ? "Review Lesson" : "Start Lesson"}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
        </Link>
      </div>
    </article>
  );
}
