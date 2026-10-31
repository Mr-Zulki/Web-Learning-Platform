import { authService } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";
import { db } from "@/lib/db";

export const instant = false;

export const metadata = {
  title: "Dashboard - HTML/CSS Platform",
};

export default async function DashboardPage() {
  const session = await authService.auth();

  if (!session?.user?.id) {
    redirect("/login?next=/dashboard");
    return null;
  }

  const lessons = getAllLessons();
  const progressRecords = await db.progress.findMany({
    where: { userId: session.user.id },
  });

  const progressMap = new Map(
    progressRecords.map((p) => [p.lessonId, p.status])
  );

  const completedCount = progressRecords.filter(
    (p) => p.status === "COMPLETED"
  ).length;
  const totalCount = lessons.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Learner Dashboard
        </h1>
        <p className="mt-1 text-base text-slate-600 dark:text-slate-400">
          Welcome back, {session.user.name || session.user.email}! Here is your
          learning journey so far.
        </p>
      </div>

      {/* Progress Bar Card */}
      <div className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-wider text-slate-600 uppercase dark:text-slate-400">
            Course Completion
          </span>
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {completedCount} of {totalCount} completed ({percentage}%)
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Overall curriculum progress"
          className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out dark:bg-blue-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Lessons List with Badges */}
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Curriculum Roadmap
      </h2>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          const status = progressMap.get(lesson.id);
          const isCompleted = status === "COMPLETED";
          const isStarted = status === "STARTED";

          return (
            <div
              key={lesson.id}
              className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Lesson {lesson.order}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Completed
                    </span>
                  ) : isStarted ? (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      In Progress
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      Not Started
                    </span>
                  )}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {lesson.title}
                </h3>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {lesson.summary}
                </p>
              </div>

              <div>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    isCompleted
                      ? "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isCompleted
                    ? "Review Lesson"
                    : isStarted
                      ? "Continue Lesson"
                      : "Start Lesson"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
