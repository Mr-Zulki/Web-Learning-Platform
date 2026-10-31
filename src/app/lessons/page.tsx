import type { Metadata } from "next";
import { getAllLessons } from "@/lib/lessons";
import { LessonCard } from "@/components/LessonCard";

export const metadata: Metadata = {
  title: "All Lessons | HTML/CSS Interactive Learning Platform",
  description:
    "Browse through our comprehensive HTML and CSS curriculum with hands-on coding lessons.",
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Curriculum Lessons
        </h1>
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
          Step-by-step interactive lessons covering modern HTML structure and
          CSS design principles.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </main>
  );
}
