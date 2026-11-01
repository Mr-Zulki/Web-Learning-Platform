import type { Metadata } from "next";
import { getAllLessons } from "@/lib/lessons";
import { LessonCard } from "@/components/LessonCard";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "All Lessons | HTML/CSS Interactive Learning Platform",
  description:
    "Browse through our comprehensive HTML and CSS curriculum with hands-on coding lessons.",
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <main className="relative overflow-hidden py-12 lg:py-16">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-10">
        <div className="flex flex-col items-start gap-3">
          <Badge variant="primary" dot>
            Curriculum Roadmap
          </Badge>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Curriculum Lessons
            </h1>
          </div>
          <p className="max-w-2xl text-base text-slate-300">
            Step-by-step interactive lessons covering modern HTML structure and
            CSS design principles. Complete the challenges to test your
            knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </Container>
    </main>
  );
}
