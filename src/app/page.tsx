import Link from "next/link";
import { getAllLessons } from "@/lib/lessons";

export default function Home() {
  const lessons = getAllLessons();

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-low to-surface pt-12 pb-24 md:pt-16 md:pb-32">
        {/* Ambient Background Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-secondary-fixed/40 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 -right-24 w-[420px] h-[340px] bg-primary-fixed/50 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative w-full max-w-7xl mx-auto px-margin md:px-margin-desktop">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-high shadow-sm mb-space-lg transition-transform hover:scale-105 duration-200">
              <span className="text-body-sm font-body-sm">⚡</span>
              <span className="font-label-pill text-label-pill text-primary font-bold uppercase tracking-wider">
                CodeCraft Frontend Engineering Track
              </span>
            </div>

            {/* Display Heading */}
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight text-balance">
              Learn HTML &amp; CSS by{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary-container bg-clip-text text-transparent">
                Actually Writing Code.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-space-lg font-body-lg text-body-lg text-on-surface-variant max-w-2xl text-balance leading-relaxed">
              Interactive web engineering curriculum, instant in-browser test feedback, and real-time execution. Build production-grade layout instincts without local config overhead.
            </p>

            {/* CTA Action Group */}
            <div className="mt-space-xl flex flex-col sm:flex-row items-center gap-space-md w-full justify-center">
              <Link
                href="/register"
                className="w-full sm:w-auto px-space-xl py-3.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-on-primary font-title-md text-title-md shadow-[0_8px_24px_-4px_rgba(61,82,160,0.35)] hover:shadow-[0_12px_32px_rgba(112,145,230,0.5)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-space-sm group focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <span>Start Learning for Free</span>
                <span className="font-body-sm text-body-sm opacity-80">(No Credit Card)</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/lessons"
                className="w-full sm:w-auto px-space-lg py-3.5 rounded-xl bg-surface-container-high hover:bg-surface-variant text-on-secondary-container font-title-md text-title-md shadow-sm transition-all flex items-center justify-center gap-space-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <span
                  className="material-symbols-outlined text-secondary text-[22px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
                <span>Explore 5 Core Lessons</span>
              </Link>
            </div>

            {/* Social Proof Stats Pill Row */}
            <div className="mt-space-xl flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-on-surface-variant font-body-md text-body-md">
              <div className="flex items-center gap-space-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  group
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {lessons.length} lessons
                </span>
                <span className="text-outline text-body-sm font-body-sm">
                  &amp; challenges
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:inline-block" />
              <div className="flex items-center gap-space-xs">
                <span
                  className="material-symbols-outlined text-secondary text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Live browser preview
                </span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant hidden sm:inline-block" />
              <div className="flex items-center gap-space-xs">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  5 Core lessons
                </span>
              </div>
            </div>
          </div>

          {/* Hero Interactive Mockup Teaser */}
          <div className="mt-space-xl relative w-full rounded-2xl bg-inverse-surface shadow-[0_24px_64px_-12px_rgba(28,26,35,0.35)] overflow-hidden">
            {/* Window Chrome / Metadata Bar */}
            <div className="w-full bg-[#131722] px-space-md py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-space-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="hidden sm:flex items-center gap-space-xs ml-space-md bg-[#252D4A] px-2.5 py-1 rounded-md text-[#ADBBDA]">
                  <span className="material-symbols-outlined text-[15px]">terminal</span>
                  <span className="font-label-code-sm text-label-code-sm">
                    workspace-sandbox.html
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-label-code-sm text-label-code-sm text-[#ADBBDA] bg-[#252D4A] px-2.5 py-1 rounded-full">
                  Lesson 01: HTML Structure
                </span>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#10B981]/20 text-[#10B981] font-label-code-sm text-label-code-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span>
                  <span>All Tests Passed! 🎉</span>
                </div>
              </div>
            </div>

            {/* 3-Panel Split IDE Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] bg-[#1a1f30]">
              {/* Left Panel: Guided Instructions (3 cols) */}
              <div className="lg:col-span-3 bg-[#131722] p-space-lg flex flex-col justify-between">
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-2 py-0.5 rounded bg-secondary/30 text-secondary-fixed font-label-pill text-label-pill uppercase">
                      Task 1 of 3
                    </span>
                    <span className="text-body-sm font-body-sm text-[#8697C4]">4 mins left</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-white font-semibold">
                    Build a Semantic Card
                  </h2>
                  <p className="font-body-md text-body-md text-[#ADBBDA] mt-1">
                    Add an{" "}
                    <code className="font-label-code-sm text-label-code-sm bg-[#252D4A] px-1.5 py-0.5 rounded text-secondary-fixed">
                      &lt;article&gt;
                    </code>{" "}
                    element wrapping a heading and an action button styled with CSS flexbox.
                  </p>

                  {/* Live Requirements Checklist */}
                  <div className="mt-space-md flex flex-col gap-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-[#10B981]/10 text-white font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[#10B981] text-[18px]">
                        check_circle
                      </span>
                      <span>Root element contains &lt;article&gt;</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-[#10B981]/10 text-white font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[#10B981] text-[18px]">
                        check_circle
                      </span>
                      <span>Heading is h2 with class &quot;title&quot;</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-[#10B981]/10 text-white font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-[#10B981] text-[18px]">
                        check_circle
                      </span>
                      <span>Primary CTA has rounded corners</span>
                    </div>
                  </div>
                </div>
                <div className="pt-space-md flex items-center justify-between text-[#8697C4] text-body-sm font-body-sm">
                  <span>Automated grading</span>
                  <span className="text-[#10B981] font-semibold">3 / 3 Complete</span>
                </div>
              </div>

              {/* Middle Panel: Code Editor (5 cols) */}
              <div className="lg:col-span-5 bg-[#171c2c] p-space-md flex flex-col font-label-code-sm text-label-code-sm shadow-inner">
                <div className="flex items-center justify-between pb-3 text-[#ADBBDA]">
                  <div className="flex items-center gap-space-md">
                    <span className="text-white font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary" /> index.html
                    </span>
                    <span className="text-[#8697C4] hover:text-white cursor-pointer transition-colors">
                      style.css
                    </span>
                  </div>
                  <span className="font-label-code-sm text-label-code-sm text-[#8697C4]">
                    UTF-8
                  </span>
                </div>

                {/* Code Syntax Representation using real starter code from html-structure.json */}
                <div className="flex-1 font-label-code-sm text-label-code-sm leading-relaxed overflow-x-auto text-[#c5c5d3] py-2 flex flex-col gap-1">
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">1</span>
                    <span>
                      <span className="text-[#79b8ff]">&lt;!DOCTYPE html&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">2</span>
                    <span>
                      <span className="text-[#f97583]">&lt;html</span>{" "}
                      <span className="text-[#b392f0]">lang</span>=
                      <span className="text-[#9ecbff]">&quot;en&quot;</span>
                      <span className="text-[#f97583]">&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">3</span>
                    <span className="pl-4">
                      <span className="text-[#f97583]">&lt;head&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">4</span>
                    <span className="pl-8">
                      <span className="text-[#f97583]">&lt;meta</span>{" "}
                      <span className="text-[#b392f0]">charset</span>=
                      <span className="text-[#9ecbff]">&quot;UTF-8&quot;</span>
                      <span className="text-[#f97583]">&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">5</span>
                    <span className="pl-8">
                      <span className="text-[#f97583]">&lt;title&gt;</span>
                      <span className="text-[#79b8ff]">My First Page</span>
                      <span className="text-[#f97583]">&lt;/title&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">6</span>
                    <span className="pl-4">
                      <span className="text-[#f97583]">&lt;/head&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">7</span>
                    <span className="pl-4">
                      <span className="text-[#f97583]">&lt;body&gt;</span>
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-7 text-[#505a7a] select-none">8</span>
                    <span className="pl-8">
                      <span className="text-[#f97583]">&lt;h1&gt;</span>
                      <span className="text-[#79b8ff]">Hello, World!</span>
                      <span className="text-[#f97583]">&lt;/h1&gt;</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-[#8697C4] text-body-sm font-body-sm">
                    Auto-saves instantly
                  </span>
                  <Link
                    href="/lessons/html-structure"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-label-code-sm text-label-code-sm font-semibold flex items-center gap-1.5 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    <span>Run Tests</span>
                    <kbd className="ml-1 text-[10px] bg-emerald-700/60 px-1 py-0.5 rounded text-emerald-100">
                      ⌘↵
                    </kbd>
                  </Link>
                </div>
              </div>

              {/* Right Panel: Live Browser Preview (4 cols) */}
              <div className="lg:col-span-4 bg-surface p-space-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 text-outline">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-body-sm text-body-sm font-medium text-on-surface">
                        Live Preview
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </div>

                  {/* Rendered Mock Component Card in Live Preview */}
                  <div className="mt-space-md p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col gap-space-sm transition-all hover:shadow-lg">
                    <span className="self-start px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-pill text-label-pill uppercase">
                      Interactive Lab
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Modern Front-End
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Learn directly in your browser with zero latency. Instant visual validation helps concepts stick faster.
                    </p>
                    <Link
                      href="/lessons/html-structure"
                      className="mt-2 w-full py-2 rounded-lg bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container transition-colors text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      Continue
                    </Link>
                  </div>
                </div>

                {/* Toast-Style Notification */}
                <div className="mt-4 p-space-sm rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-emerald-600 text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="font-body-sm text-body-sm font-semibold">
                      Test Suite: 100% Passed
                    </span>
                  </div>
                  <span className="font-label-code-sm text-label-code-sm text-emerald-700">12ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE FEATURES SECTION: WHY CHOOSE CODECRAFT */}
      <section className="w-full py-20 bg-surface-container-low">
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-label-pill text-label-pill uppercase tracking-widest text-secondary font-bold">
              Engineered for Accelerated Mastery
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mt-2 font-bold tracking-tight">
              Why Engineers Choose CodeCraft
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
              Passive video lectures create tutorial friction. CodeCraft replaces passive consumption with active, test-driven browser execution designed for modern software teams.
            </p>
          </div>

          {/* 3 Feature Cards with Metallic Chic Styling */}
          <div className="mt-space-xl grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Feature 1 */}
            <div className="relative group rounded-2xl bg-surface-container-lowest p-space-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-secondary-fixed flex items-center justify-center text-primary shadow-sm mb-space-lg group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    menu_book
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Read &amp; Understand
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                  Concise, bite-sized lessons focused on practical modern web fundamentals without endless walls of theoretical text.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-xs text-primary font-title-md text-title-md">
                <span>Learn in 5-minute sprints</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group rounded-2xl bg-surface-container-lowest p-space-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm mb-space-lg group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    code
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Live In-Browser IDE
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                  Write real HTML and CSS with instant hot-reloading preview right in your browser. No terminal commands or complex config.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-xs text-primary font-title-md text-title-md">
                <span>Real-time live DOM reload</span>
                <span className="material-symbols-outlined text-[18px]">sync</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group rounded-2xl bg-surface-container-lowest p-space-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
              <div className="flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm mb-space-lg group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    fact_check
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Instant Automated Testing
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                  Get immediate validation and helpful diagnostic hints as you type every line of code. Never get stuck without a path forward.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-xs text-primary font-title-md text-title-md">
                <span>Automated assertion checks</span>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CURRICULUM & 5 CORE LESSONS PREVIEW */}
      <section className="w-full py-20 bg-surface" id="curriculum">
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-pill text-label-pill uppercase tracking-widest text-primary font-bold">
                Frontend Engineering Track
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mt-2 font-bold tracking-tight">
                From Fundamentals to Responsive Production in 5 Modules
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Each module pairs focused architecture principles with automated test suites matching production frontend standards.
            </p>
          </div>

          {/* 5 Core Lessons Cards Mosaic + Launch Spotlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {lessons.map((lesson, idx) => {
              const bgPill = [
                "bg-primary-fixed text-primary",
                "bg-secondary-fixed text-secondary",
                "bg-tertiary-fixed text-tertiary",
                "bg-primary-fixed-dim text-primary",
                "bg-secondary-fixed-dim text-secondary",
              ][idx % 5];

              const difficulty = idx < 2 ? "Beginner" : idx === 2 ? "Core" : "Intermediate";

              const tags = [
                ["<!DOCTYPE html>", "<head>", "<meta>"],
                ["<h1>..<h6>", "<p>", "<ul> & <ol>"],
                ["<a href>", "<img alt>", 'target="_blank"'],
                [".class-name", "#element-id", ":nth-child()"],
                ["margin", "padding", "border-box"],
              ][idx % 5];

              const estTime = [
                "15 mins · 1 Challenge",
                "20 mins · 1 Challenge",
                "25 mins · 1 Challenge",
                "30 mins · 1 Challenge",
                "35 mins · 1 Challenge",
              ][idx % 5];

              return (
                <div
                  key={lesson.id}
                  className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <span className={`px-2.5 py-1 rounded-md font-label-code-sm text-label-code-sm font-semibold ${bgPill}`}>
                        Lesson 0{lesson.order}
                      </span>
                      <span className="font-label-pill text-label-pill uppercase text-outline">
                        {difficulty}
                      </span>
                    </div>
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                    >
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                    </Link>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      {lesson.summary}
                    </p>
                    <div className="mt-space-md flex flex-wrap gap-1.5">
                      {(tags ?? []).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-code-sm text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-space-lg pt-space-sm flex items-center justify-between text-body-sm font-body-sm border-t border-surface-variant/30">
                    <span className="text-outline">{estTime}</span>
                    <Link
                      href={`/lessons/${lesson.id}`}
                      className="font-title-md text-title-md text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
                    >
                      Launch Lab{" "}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Quick Launch Spotlight / Callout Card */}
            <div className="rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary p-space-xl text-on-primary shadow-lg flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-label-pill text-label-pill uppercase tracking-wider">
                  Fast Start
                </span>
                <h3 className="font-headline-md text-headline-md text-white font-bold mt-space-md">
                  Try Lesson 1 Right Now
                </h3>
                <p className="font-body-md text-body-md text-white/80 mt-space-xs leading-relaxed">
                  No account creation needed. Open the live sandbox and write your very first HTML doctype within 30 seconds.
                </p>
              </div>
              <Link
                href="/lessons/html-structure"
                className="mt-space-xl w-full py-3.5 px-space-md rounded-xl bg-white text-primary font-title-md text-title-md shadow-md hover:bg-surface-bright transition-colors flex items-center justify-center gap-space-xs font-semibold focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
              >
                <span>Launch Interactive Sandbox</span>
                <span className="material-symbols-outlined text-[18px]">terminal</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDENT TESTIMONIALS & SUCCESS STORIES */}
      <section className="w-full py-20 bg-surface-container-low">
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-pill text-label-pill uppercase tracking-widest text-secondary font-bold">
              ENGINEERING VELOCITY
            </span>
            <h2 className="font-headline-xl text-headline-xl text-on-surface mt-2 font-bold tracking-tight">
              Trusted by Learners Building Real Pages
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-sm">
              See how immediate feedback accelerates skill velocity from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-space-md">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                  &quot;I spent weeks on passive video courses without true layout independence. The immediate AST and visual assertion tests explained margin behavior and document flow instantly. Pure velocity.&quot;
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    Learner
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Frontend Student
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-space-md">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                  &quot;The split-screen IDE feels as slick as VS Code, but with zero installation pain. The keyboard shortcut support (Ctrl + Enter to test) makes the interactive practice loop flow effortlessly.&quot;
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">code</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    Learner
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    CSS Practitioner
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-surface-container-lowest p-space-xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-space-md">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed italic">
                  &quot;Working through the five core modules gave me a solid mental model of HTML semantics and the box model. It eliminated syntax friction before building real web projects.&quot;
                </p>
              </div>
              <div className="mt-space-lg pt-space-md flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <div>
                  <h4 className="font-title-md text-title-md text-on-surface font-bold">
                    Learner
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Web Engineering Learner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA BANNER SECTION */}
      <section className="w-full py-20 bg-surface">
        <div className="w-full max-w-7xl mx-auto px-margin md:px-margin-desktop">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-space-xl md:p-16 text-on-primary shadow-2xl">
            {/* Decorative Ambient Overlays */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -top-12 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-space-md backdrop-blur-md">
                <span className="material-symbols-outlined text-[26px]">terminal</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl text-white font-extrabold tracking-tight">
                Ready to build your first website today?
              </h2>
              <p className="font-body-lg text-body-lg text-white/90 mt-space-sm max-w-lg">
                Join learners writing clean, modern HTML and CSS with instant automated verification.
              </p>

              {/* Instant Signup Input Form with standard GET navigation */}
              <form
                action="/register"
                method="GET"
                className="mt-space-xl w-full max-w-md flex flex-col sm:flex-row gap-space-xs"
              >
                <input
                  name="email"
                  className="flex-1 px-space-md py-3.5 rounded-xl bg-white text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-4 focus:ring-white/30 shadow-sm"
                  placeholder="Enter your email address"
                  required
                  type="email"
                />
                <button
                  type="submit"
                  className="px-space-lg py-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-title-md text-title-md hover:bg-black transition-colors shadow-md flex items-center justify-center gap-space-xs whitespace-nowrap font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </form>
              <p className="mt-space-md text-body-sm font-body-sm text-white/70 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">lock</span>
                <span>Zero spam. No credit card required. Free instant access.</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
