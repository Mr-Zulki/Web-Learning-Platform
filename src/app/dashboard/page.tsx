import { authService } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";
import { db } from "@/lib/db";

export const instant = false;

export const metadata = {
  title: "Learner Dashboard | CodeCraft Web Development",
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
    lessons.find((l) => progressMap.get(l.id) !== "COMPLETED") ??
    lessons[0] ?? {
      id: "html-structure",
      title: "HTML Document Structure",
      summary: "Understand the boilerplate of the modern web.",
      order: 1,
    };

  const userName = session.user.name || session.user.email?.split("@")[0] || "Student";

  return (
    <div className="flex flex-col w-full bg-surface">
      <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col gap-space-xl">
        {/* 1. WELCOME HERO HUB */}
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest shadow-[0_4px_24px_rgba(61,82,160,0.08)]">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/50 blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-20 w-80 h-80 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
          <div className="relative z-10 p-space-lg md:p-space-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-pill text-label-pill uppercase tracking-wider">
                  Frontend Track
                </span>
                <span className="text-outline text-body-sm font-body-sm">•</span>
                <span className="text-on-surface-variant text-body-sm font-body-sm font-medium">
                  Learner Dashboard
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface">
                Welcome back, {userName}! 👋
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                You are on track to finish the HTML &amp; CSS Foundation track this week. Keep your velocity high!
              </p>
              <div className="flex items-center gap-space-md pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
                <div className="flex items-center gap-1.5">
                  <span
                    className="material-symbols-outlined text-[18px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span>Track completion estimate: <strong>Thursday</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    trending_up
                  </span>
                  <span>Top 8% learner pace</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md shrink-0">
              <Link
                href={`/lessons/${nextLessonToStudy.id}`}
                className="group relative px-space-lg py-space-md rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-title-md text-title-md flex items-center justify-between gap-space-md shadow-[0_8px_24px_rgba(61,82,160,0.28)] hover:shadow-[0_12px_32px_rgba(61,82,160,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all"
              >
                <div className="flex flex-col text-left">
                  <span className="text-label-pill font-label-pill text-primary-fixed uppercase tracking-wider">
                    Next Step
                  </span>
                  <span>Continue Learning: {nextLessonToStudy.title}</span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center backdrop-blur-md group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[20px] text-on-primary">
                    arrow_forward
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. METRIC CARDS GRID (4 KPI CARDS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {/* Total Progress */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-[0_4px_20px_-2px_rgba(61,82,160,0.06)] flex flex-col justify-between group hover:shadow-[0_12px_28px_rgba(61,82,160,0.12)] transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-label-pill text-label-pill uppercase text-outline tracking-wider">
                  Total Progress
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface">
                    {percentage}%
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                    overall
                  </span>
                </div>
              </div>
              <div className="relative w-12 h-12 shrink-0">
                <svg
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-12 h-12 -rotate-90"
                  viewBox="0 0 44 44"
                >
                  <circle
                    className="text-surface-container-high"
                    cx="22"
                    cy="22"
                    fill="none"
                    r="18"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <circle
                    className="text-primary"
                    cx="22"
                    cy="22"
                    fill="none"
                    r="18"
                    stroke="currentColor"
                    strokeDasharray="113.09"
                    strokeDashoffset={113.09 - (113.09 * percentage) / 100}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-label-code-sm text-label-code-sm text-primary font-bold">
                  {completedCount}/{totalCount}
                </div>
              </div>
            </div>
            <div className="mt-space-lg bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between text-body-sm font-body-sm">
              <span className="text-on-surface-variant">Modules finished</span>
              <span className="font-semibold text-primary">
                {completedCount} of {totalCount} completed
              </span>
            </div>
          </div>

          {/* Challenges Solved */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-[0_4px_20px_-2px_rgba(61,82,160,0.06)] flex flex-col justify-between group hover:shadow-[0_12px_28px_rgba(61,82,160,0.12)] transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-label-pill text-label-pill uppercase text-outline tracking-wider">
                  Challenges Solved
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface">
                    {completedCount * 3 + (progressMap.get(nextLessonToStudy.id) === "STARTED" ? 1 : 0)}
                  </span>
                  <span className="font-title-md text-title-md text-outline font-normal">
                    / 22
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
            </div>
            <div className="mt-space-lg">
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-secondary to-primary h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round(((completedCount * 3) / 22) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-body-sm font-body-sm text-on-surface-variant">
                <span>Pass rate: 93.3%</span>
                <span className="font-semibold text-secondary">
                  {Math.max(0, 22 - completedCount * 3)} left
                </span>
              </div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-[0_4px_20px_-2px_rgba(61,82,160,0.06)] flex flex-col justify-between group hover:shadow-[0_12px_28px_rgba(61,82,160,0.12)] transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-label-pill text-label-pill uppercase text-outline tracking-wider">
                  Current Streak
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface">
                    4 Days
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center text-[22px]">
                🔥
              </div>
            </div>
            <div className="mt-space-lg bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between text-body-sm font-body-sm">
              <span className="text-on-surface-variant">Personal Best</span>
              <div className="flex items-center gap-1 font-semibold text-on-surface">
                <span>7 Days</span>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  military_tech
                </span>
              </div>
            </div>
          </div>

          {/* Time in Workspace */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-[0_4px_20px_-2px_rgba(61,82,160,0.06)] flex flex-col justify-between group hover:shadow-[0_12px_28px_rgba(61,82,160,0.12)] transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-label-pill text-label-pill uppercase text-outline tracking-wider">
                  Time in Workspace
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface">
                    3.2
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant font-normal">
                    Hours
                  </span>
                </div>
              </div>
              <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-[24px]">terminal</span>
              </div>
            </div>
            <div className="mt-space-lg bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between text-body-sm font-body-sm">
              <span className="text-on-surface-variant">Active IDE sessions</span>
              <span className="font-semibold text-primary">6 runs today</span>
            </div>
          </div>
        </div>

        {/* 3. RESUME WORKSPACE & ACTIVE CHALLENGE SPLIT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Active Challenge Card (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg md:p-space-xl shadow-[0_4px_24px_rgba(61,82,160,0.08)] flex flex-col justify-between gap-space-lg">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                  <span className="font-label-pill text-label-pill uppercase text-secondary font-bold tracking-wider">
                    Active Focus
                  </span>
                </div>
                <span className="font-label-code-sm text-label-code-sm text-outline">
                  Lesson {nextLessonToStudy.order} • Step 1 of 1
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">
                {nextLessonToStudy.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                {nextLessonToStudy.summary}
              </p>
              <div className="rounded-xl p-space-md bg-surface-container-low mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                  <div className="flex flex-col">
                    <span className="font-label-pill text-label-pill uppercase text-outline">
                      Current Checkpoint
                    </span>
                    <span className="font-title-md text-title-md text-on-surface">
                      Interactive Code Challenge
                    </span>
                  </div>
                </div>
              </div>

              {/* Code Snapshot Window */}
              <div className="rounded-xl overflow-hidden bg-tertiary shadow-inner">
                <div className="flex items-center justify-between px-space-md py-2 bg-surface-container-highest/20 text-on-tertiary-container text-body-sm font-label-code-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error" />
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim" />
                    <span className="ml-2 text-on-tertiary">styles.css</span>
                  </div>
                  <span className="text-xs text-on-tertiary-container/70">Read-only buffer</span>
                </div>
                <pre className="p-space-md text-on-tertiary font-label-code-sm text-label-code-sm overflow-x-auto leading-relaxed">
                  <code>
                    <span className="text-primary-fixed-dim">{"/* Challenge: Target card with active highlight */"}</span>{"\n"}
                    <span className="text-secondary-fixed">.card.is-active</span> {"{\n"}
                    {"  "}<span className="text-tertiary-fixed">border</span>: <span className="text-inverse-primary">2px solid</span> <span className="text-primary-fixed">#3D52A0</span>;{"\n"}
                    {"  "}<span className="text-tertiary-fixed">box-shadow</span>: <span className="text-inverse-primary">0 4px 16px</span> <span className="text-secondary-fixed-dim">rgba(61, 82, 160, 0.2)</span>;{"\n"}
                    {"  "}<span className="text-primary-fixed-dim animate-pulse">{"/* TODO: Add border-radius & transform */"}</span>{"\n"}
                    {"}"}
                  </code>
                </pre>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
              <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-outline">schedule</span>
                <span>Est. 12 mins remaining</span>
              </div>
              <Link
                href={`/lessons/${nextLessonToStudy.id}`}
                className="w-full sm:w-auto px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center gap-space-xs shadow-md hover:bg-secondary transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">code_blocks</span>
                <span>Resume in Live Editor</span>
              </Link>
            </div>
          </div>

          {/* Quick Concept Review & Mentorship (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Mentor Advice Card */}
            <div className="rounded-xl bg-surface-container-high/60 p-space-lg shadow-sm flex flex-col justify-between">
              <div className="flex items-start gap-space-md">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg shrink-0">
                  AM
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface">Alex Mercer</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Frontend Architect • Track Mentor
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface mt-2 bg-surface-container-lowest/80 p-space-sm rounded-lg">
                    &quot;Keep specificity scores low! Whenever chaining classes like <code>.card.is-active</code>, double-check that you aren&apos;t fighting element tags.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Reference Cheatsheet Snippet */}
            <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-pill text-label-pill uppercase text-outline">
                    Quick Cheatsheet
                  </span>
                  <span className="material-symbols-outlined text-outline text-[18px]">bookmark</span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface mb-space-sm">
                  CSS Specificity Cheat
                </h3>
                <ul className="space-y-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span>Element Selector (<code>h1, div</code>)</span>
                    <span className="font-label-code-sm text-label-code-sm font-semibold text-primary">0, 0, 1</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span>Class / Attribute (<code>.btn, [type]</code>)</span>
                    <span className="font-label-code-sm text-label-code-sm font-semibold text-secondary">0, 1, 0</span>
                  </li>
                  <li className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                    <span>ID Selector (<code>#main-nav</code>)</span>
                    <span className="font-label-code-sm text-label-code-sm font-semibold text-on-surface">1, 0, 0</span>
                  </li>
                </ul>
              </div>
              <div className="pt-space-md flex items-center justify-between text-body-sm font-body-sm text-secondary">
                <Link href="/lessons" className="font-semibold hover:underline flex items-center gap-1">
                  <span>View full reference docs</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DETAILED CURRICULUM PROGRESS BREAKDOWN TABLE */}
        <div className="rounded-xl bg-surface-container-lowest p-space-lg md:p-space-xl shadow-[0_4px_24px_rgba(61,82,160,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-lg">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Curriculum Roadmap Status
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                HTML &amp; CSS Foundations: 5 Core Modules
              </p>
            </div>
            <div className="flex items-center gap-space-xs text-body-sm font-body-sm text-outline">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <span>Passing threshold: 100% test assertions</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-surface-container-high">
                <tr className="bg-surface-container-low text-outline font-label-pill text-label-pill uppercase tracking-wider">
                  <th className="py-space-md px-space-lg rounded-l-lg">Module &amp; Focus</th>
                  <th className="py-space-md px-space-md">Status</th>
                  <th className="py-space-md px-space-md">Score</th>
                  <th className="py-space-md px-space-md">Assertions</th>
                  <th className="py-space-md px-space-md">Completion Date</th>
                  <th className="py-space-md px-space-lg text-right rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-body-md font-body-md text-on-surface">
                {lessons.map((lesson) => {
                  const status = progressMap.get(lesson.id);
                  const isCompleted = status === "COMPLETED";
                  const isInProgress = status === "STARTED" || (!isCompleted && lesson.id === nextLessonToStudy.id);
                  const isLocked = !isCompleted && !isInProgress;

                  return (
                    <tr
                      key={lesson.id}
                      className={`transition-colors ${
                        isInProgress
                          ? "bg-primary-fixed/20 hover:bg-primary-fixed/30"
                          : isLocked
                            ? "opacity-60 hover:bg-surface-container-low/30"
                            : "hover:bg-surface-container-low/50"
                      }`}
                    >
                      <td className="py-space-lg px-space-lg">
                        <div className="flex items-center gap-space-md">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-label-code-sm text-label-code-sm font-semibold shrink-0 ${
                              isInProgress
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-high text-primary"
                            }`}
                          >
                            0{lesson.order}
                          </div>
                          <div>
                            <span
                              className={`font-title-md text-title-md block ${
                                isInProgress ? "text-primary" : ""
                              }`}
                            >
                              {lesson.title}
                            </span>
                            <span className="text-body-sm font-body-sm text-on-surface-variant">
                              {lesson.summary}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-lg px-space-md">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-high text-primary font-label-pill text-label-pill uppercase">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>{" "}
                            Completed
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-pill text-label-pill uppercase">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />{" "}
                            In Progress
                          </span>
                        )}
                        {isLocked && (
                          <span className="inline-flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-high text-outline font-label-pill text-label-pill uppercase">
                            <span className="material-symbols-outlined text-[16px]">lock</span>{" "}
                            Locked
                          </span>
                        )}
                      </td>
                      <td className="py-space-lg px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <span className="font-bold text-on-surface">
                            {isCompleted ? "100%" : isInProgress ? "40%" : "0%"}
                          </span>
                          <div className="w-20 bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCompleted ? "bg-primary w-full" : isInProgress ? "bg-secondary w-2/5" : "w-0"
                              }`}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-space-lg px-space-md">
                        <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                          {isCompleted
                            ? "3 / 3 Passed"
                            : isInProgress
                              ? "2 / 5 Passed"
                              : "0 / 4 Passed"}
                        </span>
                      </td>
                      <td className="py-space-lg px-space-md text-body-sm font-body-sm text-on-surface-variant">
                        {isCompleted ? "May 2025" : isInProgress ? "Ongoing" : "Upcoming"}
                      </td>
                      <td className="py-space-lg px-space-lg text-right">
                        {isCompleted ? (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="px-space-md py-1.5 rounded-lg hover:bg-surface-container-high text-primary font-title-md text-body-sm transition-colors"
                          >
                            Review
                          </Link>
                        ) : isInProgress ? (
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="px-space-lg py-1.5 rounded-lg bg-primary text-on-primary font-title-md text-body-sm shadow-sm hover:bg-secondary transition-all"
                          >
                            Resume
                          </Link>
                        ) : (
                          <span className="material-symbols-outlined text-outline text-[20px]">
                            lock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. ACHIEVEMENTS & ACTIVITY HEATMAP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Achievements & Badges Showcase (7 cols) */}
          <div className="lg:col-span-7 rounded-xl bg-surface-container-lowest p-space-lg md:p-space-xl shadow-[0_4px_24px_rgba(61,82,160,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Achievements &amp; Badges
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Earn verified skill credentials as you submit clean tests
                  </p>
                </div>
                <span className="px-space-md py-1 rounded-full bg-surface-container-high font-label-pill text-label-pill uppercase text-primary font-bold">
                  {completedCount >= 3 ? "3 of 5 Earned" : `${completedCount} of 5 Earned`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md mt-space-lg">
                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center text-center group hover:bg-surface-container transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-on-primary flex items-center justify-center shadow-md mb-space-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">architecture</span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface">HTML Architect</span>
                  <span className="mt-space-sm px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-pill font-label-pill uppercase font-bold">
                    Unlocked
                  </span>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center text-center group hover:bg-surface-container transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-secondary to-primary-container text-on-primary flex items-center justify-center shadow-md mb-space-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface">Semantic Master</span>
                  <span className="mt-space-sm px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-pill font-label-pill uppercase font-bold">
                    Unlocked
                  </span>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-low flex flex-col items-center text-center group hover:bg-surface-container transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-container to-secondary-container text-on-primary flex items-center justify-center shadow-md mb-space-sm group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">bolt</span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface">Speedy Coder</span>
                  <span className="mt-space-sm px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-pill font-label-pill uppercase font-bold">
                    Unlocked
                  </span>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-high/40 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-highest text-secondary flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[28px]">palette</span>
                  </div>
                  <span className="font-title-md text-title-md text-on-surface">CSS Stylist</span>
                  <div className="w-24 bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-space-sm">
                    <div className="bg-secondary h-full" style={{ width: "66%" }} />
                  </div>
                  <span className="mt-1.5 text-label-pill font-label-pill uppercase text-secondary font-bold">
                    In Progress (2/3)
                  </span>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-high/20 opacity-60 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container text-outline flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[28px]">view_in_ar</span>
                  </div>
                  <span className="font-title-md text-title-md text-outline">Pixel Perfect</span>
                  <span className="mt-space-sm px-space-sm py-0.5 rounded-full bg-surface-container-high text-outline text-label-pill font-label-pill uppercase font-bold">
                    Locked
                  </span>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-low/50 flex flex-col items-center justify-center text-center">
                  <span className="material-symbols-outlined text-[32px] text-outline mb-1.5">
                    workspace_premium
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant">
                    Track Diploma
                  </span>
                  <span className="mt-space-sm text-label-pill font-label-pill uppercase text-outline font-semibold">
                    Unlocks at 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap / Daily Coding Habit (5 cols) */}
          <div className="lg:col-span-5 rounded-xl bg-surface-container-lowest p-space-lg md:p-space-xl shadow-[0_4px_24px_rgba(61,82,160,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Coding Activity
                </h2>
                <span className="font-label-code-sm text-label-code-sm text-on-surface-variant">
                  Last 4 Weeks
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Daily commit &amp; workspace runs recorded via browser compiler.
              </p>
              {/* Weekly Matrix Heatmap */}
              <div className="flex flex-col gap-2 bg-surface-container-low p-space-md rounded-xl">
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant px-1">
                  <span>Mon</span>
                  <span>Wed</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>
                {/* Heatmap Weeks Grid (4 weeks x 7 days) */}
                <div className="grid grid-cols-7 gap-2">
                  <div className="h-8 rounded bg-surface-container" title="Day 1: 0 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 2: 2 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 3: 3 runs" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 4: 5 runs" />
                  <div className="h-8 rounded bg-surface-container" title="Day 5: 0 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 6: 1 run" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 7: 6 runs" />

                  <div className="h-8 rounded bg-secondary-fixed" title="Day 8: 3 runs" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 9: 7 runs" />
                  <div className="h-8 rounded bg-primary" title="Day 10: 12 runs" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 11: 6 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 12: 2 runs" />
                  <div className="h-8 rounded bg-surface-container" title="Day 13: 0 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 14: 4 runs" />

                  <div className="h-8 rounded bg-secondary-container" title="Day 15: 8 runs" />
                  <div className="h-8 rounded bg-primary" title="Day 16: 14 runs" />
                  <div className="h-8 rounded bg-primary" title="Day 17: 11 runs" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 18: 7 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 19: 3 runs" />
                  <div className="h-8 rounded bg-secondary-fixed" title="Day 20: 2 runs" />
                  <div className="h-8 rounded bg-surface-container" title="Day 21: 0 runs" />

                  <div className="h-8 rounded bg-secondary-fixed" title="Day 22: 4 runs" />
                  <div className="h-8 rounded bg-secondary-container" title="Day 23: 9 runs" />
                  <div className="h-8 rounded bg-primary" title="Day 24: 15 runs" />
                  <div
                    className="h-8 rounded bg-primary relative ring-2 ring-primary ring-offset-2 ring-offset-surface-container-lowest"
                    title="Today: 18 runs"
                  >
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary" />
                  </div>
                  <div className="h-8 rounded bg-surface-container/40" title="Upcoming" />
                  <div className="h-8 rounded bg-surface-container/40" title="Upcoming" />
                  <div className="h-8 rounded bg-surface-container/40" title="Upcoming" />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between pt-space-xs text-body-sm font-body-sm text-outline">
                  <span>Less active</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-surface-container" />
                    <span className="w-3 h-3 rounded bg-secondary-fixed" />
                    <span className="w-3 h-3 rounded bg-secondary-container" />
                    <span className="w-3 h-3 rounded bg-primary" />
                  </div>
                  <span>High activity</span>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-md flex items-center justify-between text-body-sm font-body-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-on-surface">52 code test executions</span>
                <span className="text-outline">this month</span>
              </div>
              <span className="font-label-pill text-label-pill uppercase text-secondary font-bold">
                Consistent
              </span>
            </div>
          </div>
        </div>

        {/* 6. RECOMMENDED SUPPLEMENTS & PEER ACTIVITY BAR */}
        <div className="rounded-xl bg-surface-container-high/40 p-space-md md:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0">
              <span className="material-symbols-outlined text-[22px]">lightbulb</span>
            </div>
            <div>
              <span className="font-title-md text-title-md text-on-surface block">
                Need help with Class Specificity?
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Check out the interactive playground exercise or join our live community office hours today at 4:00 PM UTC.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm shrink-0 w-full md:w-auto">
            <Link
              href="/lessons/css-selectors"
              className="w-full md:w-auto px-space-md py-space-sm rounded-lg bg-surface-container-lowest font-title-md text-title-md text-primary shadow-sm hover:bg-surface-container-high text-center transition-colors"
            >
              Open Playground
            </Link>
            <a
              href="#"
              className="w-full md:w-auto px-space-md py-space-sm rounded-lg bg-primary text-on-primary font-title-md text-title-md shadow-sm hover:bg-secondary text-center transition-colors"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
