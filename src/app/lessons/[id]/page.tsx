import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllLessons,
  getLessonById,
  getAdjacentLessons,
} from "@/lib/lessons";
import { LessonSidebar } from "@/components/LessonSidebar";
import { MarkdownContent } from "@/components/MarkdownContent";
import { LessonPager } from "@/components/LessonPager";
import { LessonWorkspace } from "@/components/editor/LessonWorkspace";

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
      title: "Lesson Not Found | HTML/CSS Interactive Learning Platform",
    };
  }

  return {
    title: `${lesson.title} | HTML/CSS Interactive Learning Platform`,
    description: lesson.summary,
  };
}

export default async function LessonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  const allLessons = getAllLessons();
  const { prev, next } = getAdjacentLessons(id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Left Sidebar */}
        <LessonSidebar lessons={allLessons} currentLessonId={id} />

        {/* Workspace + Content Layout */}
        <LessonWorkspace lessonId={lesson.id} starterCode={lesson.starterCode}>
          <MarkdownContent content={lesson.body} />
          <LessonPager prev={prev} next={next} />
        </LessonWorkspace>
      </div>
    </div>
  );
}
