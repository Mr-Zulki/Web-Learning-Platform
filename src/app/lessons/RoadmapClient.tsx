"use client";

import Link from "next/link";
import { useUserProgress } from "@/lib/use-user-progress";
import type { Lesson } from "@/lib/lesson-schema";

interface RoadmapClientProps {
  lessons: Lesson[];
}

export function RoadmapClient({ lessons }: RoadmapClientProps) {
  const { completedLessonIds } = useUserProgress();
  const completedCount = completedLessonIds.size;
  const totalLessons = lessons.length || 5;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const moduleNames = [
    "HTML CORE",
    "CONTENT SEMANTICS",
    "MEDIA & ANCHORS",
    "CASCADE & SPECIFICITY",
    "BOX MODEL & FLOW",
  ];

  const estReadings = [
    "12 min reading",
    "15 min reading",
    "14 min reading",
    "18 min remaining",
    "20 min",
  ];

  const challengeCounts = [
    "3 Challenges (3/3 Verified)",
    "4 Challenges (4/4 Verified)",
    "3 Challenges (3/3 Verified)",
    "5 Challenges",
    "4 Challenges",
  ];

  const xpValues = ["150 XP", "200 XP", "150 XP", "250 XP", "300 XP"];

  // Find first uncompleted lesson as the active one
  let activeLessonIndex = lessons.findIndex((l) => !completedLessonIds.has(l.id));
  if (activeLessonIndex === -1) activeLessonIndex = lessons.length - 1;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Dynamic Atmospheric Glow */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
      <div className="absolute top-24 right-0 w-[420px] h-[420px] rounded-full bg-primary-fixed/30 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-margin md:px-margin-desktop py-space-xl">
        {/* Section Overline & Metadata Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
          <div className="flex items-center gap-space-xs text-secondary font-label-pill text-label-pill uppercase tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>Curriculum Track • Core Path 01</span>
          </div>
          <div className="flex items-center gap-space-sm text-outline font-label-code-sm text-label-code-sm">
            <span>TRACK_ID: FED-2025-V1</span>
            <span className="text-outline-variant">/</span>
            <span>EST_HOURS: 2.2H</span>
          </div>
        </div>

        {/* Main Headline + Asymmetric Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-end mb-space-xl">
          <div className="lg:col-span-7">
            <h1 className="font-headline-xl text-headline-xl md:font-display-lg md:text-display-lg text-primary tracking-tight">
              CodeCraft Web Development Roadmap
            </h1>
            <p className="mt-space-sm font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Master HTML5 &amp; CSS3 step-by-step with interactive coding challenges, live rendered workspaces, and automated verification.
            </p>
          </div>

          {/* Overall Progress Overview Card */}
          <div className="lg:col-span-5 w-full">
            <div className="relative bg-surface-container-lowest/90 backdrop-blur-md rounded-xl p-space-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-space-md mb-space-xs">
                <span className="font-label-pill text-label-pill text-secondary uppercase font-bold tracking-wide">
                  Overall Track Status
                </span>
                <span className="font-label-code-sm text-label-code-sm text-primary font-semibold">
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
                {completedCount} of {totalLessons} Lessons Mastered
              </div>
              {/* Metallic Blue Gradient Progress Bar */}
              <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden my-space-sm">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-secondary-container via-secondary to-primary"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
                  <span>
                    Est. time remaining:{" "}
                    <strong className="text-on-surface font-medium">
                      {Math.max(0, (totalLessons - completedCount) * 15)} mins
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary">military_tech</span>
                  <span>Level: Beginner → Junior</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout: 8-col Timeline & 4-col Milestone Companion */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left: Interactive Vertical Roadmap */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg">
            <div className="relative flex flex-col gap-space-lg">
              {/* Vertical Track Connector Line */}
              <div className="absolute left-6 top-8 bottom-8 w-1 bg-surface-container-high rounded-full -z-0" />

              {lessons.map((lesson, idx) => {
                const isCompleted = completedLessonIds.has(lesson.id);
                const isActive = !isCompleted && idx === activeLessonIndex;

                const moduleLabel = moduleNames[idx % moduleNames.length];
                const estTime = estReadings[idx % estReadings.length];
                const challengeStr = challengeCounts[idx % challengeCounts.length];
                const xp = xpValues[idx % xpValues.length];

                if (isCompleted) {
                  return (
                    <div key={lesson.id} className="relative pl-14 group">
                      <div className="absolute left-2.5 top-5 w-8 h-8 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center -translate-x-1/2 z-10">
                        <span
                          className="material-symbols-outlined text-[18px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      </div>
                      <div className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl p-space-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-xs">
                          <div className="flex items-center gap-space-xs font-label-code-sm text-label-code-sm text-outline">
                            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                              MODULE 0{lesson.order}
                            </span>
                            <span>•</span>
                            <span>{moduleLabel}</span>
                          </div>
                          <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-pill text-label-pill uppercase">
                            <span className="material-symbols-outlined text-[14px]">done_all</span>
                            <span>Completed</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md mt-space-xs">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-headline-sm text-headline-sm text-primary tracking-tight">
                              {lesson.order}. {lesson.title}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                              {lesson.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-space-md mt-space-md text-body-sm font-body-sm text-outline">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span>{estTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">terminal</span>
                                <span>{challengeStr}</span>
                              </div>
                              <div className="flex items-center gap-1 text-secondary font-medium">
                                <span className="material-symbols-outlined text-[16px]">star</span>
                                <span>{xp}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-space-xs md:self-center shrink-0">
                            <Link
                              href={`/lessons/${lesson.id}`}
                              className="px-space-md py-space-sm rounded-lg bg-surface-container-high text-primary hover:bg-surface-container hover:text-primary-container transition-colors font-title-md text-title-md flex items-center gap-space-xs"
                            >
                              <span className="material-symbols-outlined text-[18px]">replay</span>
                              <span>Review Lesson</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (isActive) {
                  return (
                    <div key={lesson.id} className="relative pl-14 group">
                      <div className="absolute left-2.5 top-5 w-8 h-8 rounded-full bg-secondary text-on-secondary shadow-lg shadow-secondary/40 flex items-center justify-center -translate-x-1/2 z-10 animate-bounce">
                        <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                      </div>
                      <div className="relative bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-secondary/15 transition-all duration-300 overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-container via-secondary to-primary-container" />
                        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-xs">
                          <div className="flex items-center gap-space-xs font-label-code-sm text-label-code-sm text-secondary font-semibold">
                            <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
                              MODULE 0{lesson.order}
                            </span>
                            <span>•</span>
                            <span>{moduleLabel}</span>
                          </div>
                          <div className="flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-pill text-label-pill uppercase font-bold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                            <span>In Progress</span>
                          </div>
                        </div>
                        <div className="mt-space-xs">
                          <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                            {lesson.order}. {lesson.title}
                          </h3>
                          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-2xl">
                            {lesson.summary}
                          </p>

                          <div className="mt-space-md p-space-md rounded-lg bg-surface-container-low">
                            <div className="flex items-center justify-between font-label-pill text-label-pill uppercase text-on-surface-variant mb-space-xs">
                              <span>Checkpoint Track</span>
                              <span className="font-label-code-sm text-label-code-sm font-semibold text-secondary">
                                Active Workspace
                              </span>
                            </div>
                            <div className="grid grid-cols-5 gap-space-xs">
                              <div className="h-2 rounded bg-secondary" />
                              <div className="h-2 rounded bg-secondary animate-pulse" />
                              <div className="h-2 rounded bg-surface-container-high" />
                              <div className="h-2 rounded bg-surface-container-high" />
                              <div className="h-2 rounded bg-surface-container-high" />
                            </div>
                            <div className="flex justify-between text-body-sm font-body-sm text-outline mt-space-xs">
                              <span>1. Concept Introduction ✓</span>
                              <span className="text-primary font-medium">2. Interactive Lab • Current</span>
                              <span>3. Verified Completion</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-space-md mt-space-lg pt-space-xs">
                            <div className="flex flex-wrap items-center gap-space-md text-body-sm font-body-sm text-outline">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span>{estTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">terminal</span>
                                <span>{challengeStr}</span>
                              </div>
                              <div className="flex items-center gap-1 text-secondary font-medium">
                                <span className="material-symbols-outlined text-[16px]">star</span>
                                <span>{xp}</span>
                              </div>
                            </div>
                            <Link
                              href={`/lessons/${lesson.id}`}
                              className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container shadow-md hover:shadow-xl transition-all duration-200 flex items-center gap-space-sm group/btn"
                            >
                              <span>Resume Workspace</span>
                              <span className="material-symbols-outlined text-[20px] group-hover/btn:translate-x-1 transition-transform">
                                arrow_forward
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Locked or Not Started
                return (
                  <div key={lesson.id} className="relative pl-14 group opacity-85">
                    <div className="absolute left-2.5 top-5 w-8 h-8 rounded-full bg-surface-container-high text-outline shadow-sm flex items-center justify-center -translate-x-1/2 z-10">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-space-lg transition-all duration-200">
                      <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-xs">
                        <div className="flex items-center gap-space-xs font-label-code-sm text-label-code-sm text-outline">
                          <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                            MODULE 0{lesson.order}
                          </span>
                          <span>•</span>
                          <span>{moduleLabel}</span>
                        </div>
                        <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-pill text-label-pill uppercase">
                          <span className="material-symbols-outlined text-[14px]">lock</span>
                          <span>Not Started</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-space-md mt-space-xs">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                            {lesson.order}. {lesson.title}
                          </h3>
                          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                            {lesson.summary}
                          </p>
                          <div className="flex flex-wrap items-center gap-space-md mt-space-md text-body-sm font-body-sm text-outline">
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">schedule</span>
                              <span>{estTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">terminal</span>
                              <span>{challengeStr}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">military_tech</span>
                              <span>Capstone Badge Locked</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs md:self-center shrink-0">
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className="px-space-md py-space-sm rounded-lg bg-surface-container-highest text-primary hover:bg-surface-container transition-colors font-title-md text-title-md flex items-center gap-space-xs"
                          >
                            <span>Open Lesson</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Companion Sidebar: Visual Metric Bento & Milestone Preview */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Milestone Achievement Certificate Preview Card */}
            <div className="relative bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-space-lg shadow-lg overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-secondary-fixed/50 blur-2xl" />
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs text-secondary font-label-pill text-label-pill uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
                  <span>Track Credential</span>
                </div>
                <span className="px-space-xs py-0.5 rounded font-label-code-sm text-label-code-sm bg-surface-container-high text-on-surface-variant">
                  {progressPercent === 100 ? "UNLOCKED" : `LOCKED • ${progressPercent}%`}
                </span>
              </div>
              <div className="relative w-full aspect-[4/3] rounded-lg bg-surface-container-high/60 overflow-hidden flex flex-col items-center justify-center p-space-md text-center shadow-inner">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-md mb-space-sm">
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <div className="font-headline-sm text-headline-sm text-primary tracking-tight">
                    Verified HTML &amp; CSS
                  </div>
                  <div className="font-label-pill text-label-pill text-secondary uppercase tracking-widest mt-1">
                    Foundations Badge
                  </div>
                  <div className="mt-space-sm font-label-code-sm text-label-code-sm text-outline">
                    HASH: #CC-092-2025
                  </div>
                </div>
              </div>
              <div className="mt-space-md">
                <h4 className="font-title-md text-title-md text-on-surface">Milestone Credential</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Complete all 5 core lessons to earn your Verified HTML &amp; CSS Foundation Badge and publishable portfolio credential.
                </p>
              </div>
              <div className="mt-space-md pt-space-md flex items-center justify-between font-label-code-sm text-label-code-sm text-on-surface-variant border-t border-surface-variant/40">
                <span>Required: 5 / 5 Complete</span>
                <span className="text-secondary font-semibold">
                  {Math.max(0, 5 - completedCount)} Left
                </span>
              </div>
            </div>

            {/* Quick Learning Sprint Stats Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
              <div className="flex items-center justify-between mb-space-md">
                <h4 className="font-title-md text-title-md text-primary">Learning Velocity</h4>
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
              {/* Inline Metric Sparkbars (SVG) */}
              <div className="flex items-end justify-between h-20 px-space-xs py-space-xs bg-surface-container-low rounded-lg mb-space-md">
                {[
                  { day: "M", h: "35%", active: false },
                  { day: "T", h: "60%", active: false },
                  { day: "W", h: "80%", active: false },
                  { day: "T", h: "95%", active: true },
                  { day: "F", h: "15%", active: false },
                  { day: "S", h: "20%", active: false },
                  { day: "S", h: "10%", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 w-6">
                    <div
                      className={`w-full rounded-t ${
                        item.active ? "bg-primary shadow-sm" : "bg-secondary-container"
                      }`}
                      style={{ height: item.h }}
                    />
                    <span
                      className={`font-label-code-sm text-label-code-sm ${
                        item.active ? "text-primary font-bold" : "text-outline"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-space-sm">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Completed Code Exercises</span>
                  <span className="font-label-code-sm text-label-code-sm text-primary font-bold">
                    {completedCount * 3} / 19
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Live Console Verifications</span>
                  <span className="font-label-code-sm text-label-code-sm text-secondary font-bold">
                    100% Passed
                  </span>
                </div>
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="text-on-surface-variant">Active Coding Streak</span>
                  <span className="font-label-code-sm text-label-code-sm text-on-surface font-bold">
                    4 Days 🔥
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Study Companion & Reference Shelf */}
            <div className="bg-surface-container-low rounded-xl p-space-lg">
              <div className="flex items-center gap-space-xs text-primary font-title-md text-title-md mb-space-sm">
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  auto_stories
                </span>
                <span>Fast Track Docs</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Instant references available within your IDE console panel while solving challenges.
              </p>
              <div className="flex flex-col gap-space-xs">
                <Link
                  href="/lessons/html-structure"
                  className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors text-body-sm font-body-sm text-on-surface"
                >
                  <span className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">code</span>
                    <span>HTML5 Standard Elements Cheat Sheet</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline">north_east</span>
                </Link>
                <Link
                  href="/lessons/css-selectors"
                  className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors text-body-sm font-body-sm text-on-surface"
                >
                  <span className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">tag</span>
                    <span>CSS Specificity Hierarchy Reference</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline">north_east</span>
                </Link>
                <Link
                  href="/lessons/box-model"
                  className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container-lowest hover:bg-surface-container-high transition-colors text-body-sm font-body-sm text-on-surface"
                >
                  <span className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      view_quilt
                    </span>
                    <span>The Visual Box Model Visualizer</span>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline">north_east</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
