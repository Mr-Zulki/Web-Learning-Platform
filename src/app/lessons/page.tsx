import type { Metadata } from "next";
import { getAllLessons } from "@/lib/lessons";
import { LessonCard } from "@/components/LessonCard";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "All Lessons | DevCraft HTML/CSS Platform",
  description:
    "Browse through our comprehensive HTML and CSS curriculum with hands-on coding lessons.",
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <main className="relative overflow-hidden py-12 lg:py-16">
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-[var(--orb-1)] blur-[120px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-10">
        <div className="flex flex-col items-start gap-3">
          <Badge variant="primary" dot>
            Curriculum Roadmap
          </Badge>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#3D52A0]/20 text-[#7091E6] shadow-inner">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="font-heading text-3xl font-black tracking-tight text-[var(--canvas-text)] sm:text-4xl">
              Curriculum Lessons
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--canvas-text-secondary)]">
            Step-by-step interactive lessons covering modern HTML structure and
            CSS design principles. Complete the challenges in the live workspace
            to verify your knowledge.
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
