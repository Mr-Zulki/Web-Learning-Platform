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

        {/* Content Area + Editor Slot */}
        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            {/* Left Column: Lesson Content */}
            <div className="min-w-0">
              <MarkdownContent content={lesson.body} />
              <LessonPager prev={prev} next={next} />
            </div>

            {/* Right Column: Editor Slot Placeholder */}
            <div className="lg:sticky lg:top-20">
              <div
                aria-label="Code Editor Placeholder"
                className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="rounded-full bg-blue-100 p-4 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <span className="font-mono text-xl font-bold">&lt;/&gt;</span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">
                  Interactive Live Code Editor
                </h3>
                <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                  Editor coming in Phase 2
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  Reserved workspace slot for editor &amp; preview sandbox
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
