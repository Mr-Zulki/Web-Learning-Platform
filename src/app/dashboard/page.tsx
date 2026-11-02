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
  title: "Learner Dashboard - DevCraft HTML/CSS Platform",
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
        className="pointer-events-none absolute top-10 left-1/2 -z-10 h-96 w-[700px] -translate-x-1/2 rounded-full bg-[var(--orb-1)] blur-[120px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-10">
        {/* Header Greeting */}
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <h1 className="font-heading text-3xl font-black tracking-tight text-[var(--canvas-text)]">
              Learner Dashboard
            </h1>
            <p className="text-sm text-[var(--canvas-text-secondary)] sm:text-base">
              Welcome back,{" "}
              <span className="font-bold text-[var(--canvas-text)]">
                {session.user.name || session.user.email}
              </span>
              ! Here is your verified curriculum progress.
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
            className="metallic-top-edge flex flex-col items-center justify-center space-y-5 p-8 text-center lg:col-span-1"
          >
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[var(--canvas-text-muted)] uppercase">
              <TrendingUp className="h-4 w-4 text-[#7091E6]" />
              <span>Curriculum Completion</span>
            </div>

            <ProgressRing
              aria-hidden="true"
              value={percentage}
              max={100}
              size={140}
              strokeWidth={10}
              variant={percentage === 100 ? "success" : "primary"}
            >
              <span className="text-3xl font-black tracking-tight text-[var(--canvas-text)]">
                {percentage}%
              </span>
              <span className="text-[11px] font-semibold text-[var(--canvas-text-muted)]">
                completed
              </span>
            </ProgressRing>

            <div className="text-sm font-bold text-[#7091E6]">
              {completedCount} of {totalCount} completed ({percentage}%)
            </div>

            {/* Standard accessible progressbar element */}
            <div
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Overall curriculum progress"
              className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/15 dark:bg-white/10"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3D52A0] via-[#7091E6] to-[#ADBBDA] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </Card>

          {/* Continue Learning Feature Card */}
          {nextLessonToStudy && (
            <Card
              variant="elevated"
              className="metallic-top-edge flex flex-col justify-between p-8 lg:col-span-2"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" dot>
                    Resume Learning
                  </Badge>
                  <span className="text-xs font-semibold text-[var(--canvas-text-muted)]">
                    Lesson {nextLessonToStudy.order} of {totalCount}
                  </span>
                </div>

                <h2 className="font-heading text-2xl font-bold tracking-tight text-[var(--canvas-text)] sm:text-3xl">
                  {nextLessonToStudy.title}
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--canvas-text-secondary)] sm:text-base">
                  {nextLessonToStudy.summary}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4 text-xs font-semibold text-[var(--canvas-text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {Math.max(
                      2,
                      Math.ceil(
                        nextLessonToStudy.body.trim().split(/\s+/).length / 150
                      )
                    )}{" "}
                    min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    Interactive Challenge Included
                  </span>
                </div>

                <Link href={`/lessons/${nextLessonToStudy.id}`}>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="font-bold shadow-lg"
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
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-[#7091E6]" />
            <h2 className="font-heading text-xl font-bold tracking-tight text-[var(--canvas-text)]">
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
                  className="glass-panel flex flex-col justify-between gap-4 rounded-2xl p-5 shadow-lg transition-all duration-150 hover:border-[#7091E6]/40 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold tracking-wider text-[var(--canvas-text-muted)]">
                        Lesson {lesson.order}
                      </span>
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completed
                        </span>
                      ) : isStarted ? (
                        <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-0.5 text-xs font-medium text-[var(--canvas-text-muted)] dark:bg-black/30">
                          Not Started
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-[var(--canvas-text)]">
                      {lesson.title}
                    </h3>
                    <p className="max-w-2xl text-xs leading-relaxed text-[var(--canvas-text-secondary)] sm:text-sm">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="pt-2 sm:shrink-0 sm:pt-0">
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button
                        variant={isCompleted ? "outline" : "primary"}
                        size="sm"
                        className="font-semibold"
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
