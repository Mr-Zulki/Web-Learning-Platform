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

  return (
    <article className="group glass-panel relative flex flex-col justify-between rounded-2xl border border-white/10 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="primary" dot={!isCompleted}>
            Lesson {lesson.order}
          </Badge>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              {Math.max(3, Math.ceil(lesson.body.length / 500))}m
            </span>
            {isCompleted && (
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400"
                aria-label="Lesson completed"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Completed
              </span>
            )}
          </div>
        </div>

        <h2 className="mt-4 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
          <Link
            href={`/lessons/${lesson.id}`}
            className="focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {lesson.title}
          </Link>
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {lesson.summary}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <Link
          href={`/lessons/${lesson.id}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
          aria-label={`Start lesson: ${lesson.title}`}
        >
          <span>{isCompleted ? "Review lesson" : "Start lesson"}</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
