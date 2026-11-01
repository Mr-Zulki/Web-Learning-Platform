import { authService } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAllLessons } from "@/lib/lessons";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";

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

  // Next recommended lesson: first non-completed lesson
  const nextLessonToStudy =
    lessons.find((l) => progressMap.get(l.id) !== "COMPLETED") || lessons[0];

  return (
    <main className="relative overflow-hidden py-10 sm:py-14">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-10">
        {/* Header Greeting */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-white">
              Learner Dashboard
            </h1>
            <p className="text-sm text-slate-400 sm:text-base">
              Welcome back,{" "}
              <span className="font-semibold text-slate-200">
                {session.user.name || session.user.email}
              </span>
              ! Here is your learning journey so far.
            </p>
          </div>
          <Badge variant="primary" dot className="self-start sm:self-auto">
            Account Active
          </Badge>
        </div>

        {/* Overview Stats & Continue Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Circular Progress & Metrics */}
          <Card
            variant="elevated"
            className="flex flex-col items-center justify-center space-y-4 p-8 text-center lg:col-span-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Course Completion</span>
            </div>

            <ProgressRing
              aria-hidden="true"
              value={percentage}
              max={100}
              size={140}
              strokeWidth={10}
              variant={percentage === 100 ? "success" : "primary"}
            >
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {percentage}%
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                completed
              </span>
            </ProgressRing>

            <div className="text-sm font-semibold text-blue-400">
              {completedCount} of {totalCount} completed ({percentage}%)
            </div>

            {/* Standard accessible progressbar element */}
            <div
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall curriculum progress"
              className="h-2 w-full overflow-hidden rounded-full border border-white/5 bg-slate-800/80"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </Card>

          {/* Continue Learning Feature Card */}
          {nextLessonToStudy && (
            <Card
              variant="elevated"
              className="flex flex-col justify-between border-blue-500/20 bg-gradient-to-br from-blue-950/30 to-slate-900/60 p-8 lg:col-span-2"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" dot>
                    Resume Learning
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Lesson {nextLessonToStudy.order} of {totalCount}
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
                  {nextLessonToStudy.title}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  {nextLessonToStudy.summary}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {Math.max(
                      3,
                      Math.ceil(nextLessonToStudy.body.length / 500)
                    )}{" "}
                    min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Interactive Challenge Included
                  </span>
                </div>

                <Link href={`/lessons/${nextLessonToStudy.id}`}>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {progressMap.get(nextLessonToStudy.id) === "STARTED"
                      ? "Continue Lesson"
                      : "Start Lesson"}
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Lessons Roadmap List */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h2 className="font-heading text-xl font-bold tracking-tight text-white">
              Curriculum Roadmap
            </h2>
          </div>

          <div className="space-y-4">
            {lessons.map((lesson) => {
              const status = progressMap.get(lesson.id);
              const isCompleted = status === "COMPLETED";
              const isStarted = status === "STARTED";

              return (
                <div
                  key={lesson.id}
                  className="glass-panel flex flex-col justify-between gap-4 rounded-2xl border border-white/10 p-5 shadow-md transition-all duration-150 hover:border-white/20 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-semibold tracking-wider text-slate-400">
                        Lesson {lesson.order}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : isStarted ? (
                        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                          Not Started
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {lesson.title}
                    </h3>
                    <p className="max-w-2xl text-xs text-slate-300 sm:text-sm">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="pt-2 sm:shrink-0 sm:pt-0">
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button
                        variant={isCompleted ? "outline" : "primary"}
                        size="sm"
                      >
                        {isCompleted
                          ? "Review Lesson"
                          : isStarted
                            ? "Continue Lesson"
                            : "Start Lesson"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </main>
  );
}
