import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllLessons,
  getLessonById,
  getAdjacentLessons,
} from "@/lib/lessons";
import { getChallengeForLesson, toClientChallenge } from "@/lib/challenges";
import { MarkdownContent } from "@/components/MarkdownContent";
import { LessonPager } from "@/components/LessonPager";
import { LessonWorkspace } from "@/components/editor/LessonWorkspace";

export const instant = false;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const lessons = getAllLessons();
  return lessons.map((lesson) => ({
    id: lesson.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    return {
      title: "Lesson Not Found | CodeCraft",
    };
  }

  return {
    title: `${lesson.title} | CodeCraft Interactive Workspace`,
    description: lesson.summary,
  };
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const { prev, next } = getAdjacentLessons(id);
  const challengeRaw = getChallengeForLesson(lesson.id);
  const clientChallenge = challengeRaw ? toClientChallenge(challengeRaw) : null;
  const nextLessonSummary = next ? { id: next.id, title: next.title } : null;

  return (
    <div className="w-full flex-1 flex flex-col">
      <LessonWorkspace
        key={lesson.id}
        lessonId={lesson.id}
        starterCode={lesson.starterCode}
        challenge={clientChallenge}
        nextLesson={nextLessonSummary}
      >
        <div className="space-y-4">
          <MarkdownContent content={lesson.body} />
          <LessonPager prev={prev} next={next} />
        </div>
      </LessonWorkspace>
    </div>
  );
}
