import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  Terminal,
  Eye,
  Clock,
} from "lucide-react";
import { getAllLessons } from "@/lib/lessons";
import { Container } from "@/components/ui/Container";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const lessons = getAllLessons();

  const marqueeFeatures = [
    "Sandboxed Live Preview (allow-scripts)",
    "Deterministic AST Checking (parse5 & css-tree)",
    "Non-Blocking Asynchronous crypto.scrypt",
    "Stateless Signed JWT Sessions",
    "Atomic PostgreSQL Distributed Rate Limiting",
    "Zero Client Telemetry & Local Execution",
    "Responsive 3-Pane Workspace & 4-Tab Mobile",
  ];

  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden py-12 lg:py-20">
      {/* Floating subtle background orbs (Transform-only, GPU accelerated) */}
      <div
        className="animate-float-slow pointer-events-none absolute -top-40 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[var(--orb-1)] blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="animate-float-reverse pointer-events-none absolute top-1/3 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-[var(--orb-2)] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="animate-float-slow pointer-events-none absolute bottom-10 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-[var(--orb-3)] blur-[100px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-24">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center space-y-8 pt-4 text-center">
          <Badge
            variant="primary"
            dot
            className="px-4 py-1.5 text-xs font-semibold tracking-wide"
          >
            Interactive Web Development Curriculum
          </Badge>

          <div className="max-w-4xl space-y-6">
            <h1 className="font-heading text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-[var(--canvas-text)]">
                Master Modern
              </span>
              <span className="text-metallic block">
                HTML & CSS Engineering
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--canvas-text-secondary)] sm:text-xl">
              Learn web fundamentals in a freeCodeCamp-style 3-pane interactive
              workspace. Write real code, see instant sandboxed output, and pass
              deterministic AST checks.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/lessons">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="font-bold shadow-xl"
              >
                Start Learning Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="font-semibold">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* 3D-LOOKING GLASS STACK (Hero Visual with real Lesson 1 code) */}
          <div className="w-full max-w-4xl pt-6 perspective-[1000px]">
            <div className="glass-panel-elevated relative overflow-hidden rounded-3xl p-1 shadow-2xl transition-transform duration-300 sm:p-2">
              {/* Top ambient highlight strip */}
              <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-[#ADBBDA] via-[#7091E6] to-[#3D52A0]" />

              {/* Decorative Window Chrome */}
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80 shadow-sm" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80 shadow-sm" />
                  <span className="ml-3 font-mono text-xs font-medium text-[var(--canvas-text-muted)]">
                    index.html — HTML Structure Workspace
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Verified AST Spec</span>
                </div>
              </div>

              {/* Real Code Split Mockup */}
              <div className="grid grid-cols-1 divide-y divide-white/10 text-left font-mono text-xs md:grid-cols-2 md:divide-x md:divide-y-0">
                {/* Real First Lesson Starter Code (HTML & CSS) */}
                <div className="space-y-2 overflow-x-auto bg-black/20 p-5 text-[var(--canvas-text)] dark:bg-black/40">
                  <div className="text-[var(--canvas-text-muted)]">
                    {"<!-- Real Lesson 1 Starter Code -->"}
                  </div>
                  <div>
                    <span className="text-[#7091E6]">
                      &lt;!DOCTYPE html&gt;
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7091E6]">&lt;html</span>{" "}
                    <span className="text-[#ADBBDA]">lang</span>=
                    <span className="text-emerald-400">&quot;en&quot;</span>
                    <span className="text-[#7091E6]">&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#7091E6]">&lt;head&gt;</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-[#7091E6]">&lt;title&gt;</span>
                    <span>My First Page</span>
                    <span className="text-[#7091E6]">&lt;/title&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#7091E6]">&lt;/head&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#7091E6]">&lt;body&gt;</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-[#7091E6]">&lt;h1&gt;</span>
                    <span className="font-bold">Hello, World!</span>
                    <span className="text-[#7091E6]">&lt;/h1&gt;</span>
                  </div>
                  <div className="pl-8 text-[var(--canvas-text-secondary)]">
                    <span className="text-[#7091E6]">&lt;p&gt;</span>
                    <span>Welcome to HTML fundamentals.</span>
                    <span className="text-[#7091E6]">&lt;/p&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#7091E6]">&lt;/body&gt;</span>
                  </div>
                  <div>
                    <span className="text-[#7091E6]">&lt;/html&gt;</span>
                  </div>
                </div>

                {/* Styled Live Preview Card Representation */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#3D52A0]/10 via-[#7091E6]/5 to-transparent p-6 sm:p-8">
                  <div className="glass-panel w-full max-w-sm rounded-2xl p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-xs font-bold tracking-wider text-[var(--canvas-text-muted)] uppercase">
                          Browser Preview
                        </span>
                      </div>
                      <Badge variant="primary">100% Zoom</Badge>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl font-extrabold text-[var(--canvas-text)]">
                        Hello, World!
                      </h3>
                      <p className="text-xs leading-relaxed text-[var(--canvas-text-secondary)]">
                        Welcome to HTML fundamentals. Rendered inside a secure,
                        sandboxed null-origin container.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP (Real platform features) */}
        <section
          className="glass-panel overflow-hidden rounded-2xl py-3"
          aria-label="Platform Highlights"
        >
          <div className="animate-marquee flex w-max gap-8">
            {[...marqueeFeatures, ...marqueeFeatures].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs font-semibold whitespace-nowrap text-[var(--canvas-text-secondary)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#7091E6]" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BENTO GRID: 4 PLATFORM PILLARS */}
        <section className="space-y-8">
          <div className="space-y-3 text-center">
            <Badge variant="primary" dot>
              Engineering Architecture
            </Badge>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[var(--canvas-text)] sm:text-4xl">
              Built for Real Learning Outcomes
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[var(--canvas-text-secondary)] sm:text-base">
              A high-performance pedagogical engine combining live feedback with
              sandboxed isolation and deterministic evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Tile 1: Large Span 2 */}
            <Card
              variant="base"
              className="metallic-top-edge space-y-4 md:col-span-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3D52A0]/20 text-[#7091E6] shadow-inner">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--canvas-text)]">
                Live CodeMirror 6 Workspace
              </h3>
              <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
                Modular in-browser code editor with HTML & CSS syntax
                highlighting, keyboard accessibility traps release via Escape
                key, auto-indentation, and local draft persistence under
                `uni:draft:&lt;lessonId&gt;`.
              </p>
            </Card>

            {/* Tile 2: Standard Span 1 */}
            <Card variant="base" className="metallic-top-edge space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-inner dark:text-emerald-400">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--canvas-text)]">
                Instant Sandboxed Preview
              </h3>
              <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
                Renders user HTML/CSS inside an isolated iframe with
                `sandbox=&quot;allow-scripts&quot;` and strict CSP prohibiting
                network egress or cookie leakage.
              </p>
            </Card>

            {/* Tile 3: Standard Span 1 */}
            <Card variant="base" className="metallic-top-edge space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-500 shadow-inner dark:text-purple-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--canvas-text)]">
                Deterministic AST Checking
              </h3>
              <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
                Pure static AST parsing via parse5 and css-tree. Validates exact
                structural specifications without arbitrary code execution or
                browser DOM dependencies.
              </p>
            </Card>

            {/* Tile 4: Large Span 2 */}
            <Card
              variant="base"
              className="metallic-top-edge space-y-4 md:col-span-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7091E6]/20 text-[#7091E6] shadow-inner">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-[var(--canvas-text)]">
                Resilient Stateless Infrastructure
              </h3>
              <p className="text-sm leading-relaxed text-[var(--canvas-text-secondary)]">
                Next.js multi-replica container instances balanced by Nginx with
                round-robin failover, sub-millisecond edge caching, atomic
                PostgreSQL rate limits, and stateless JWT sessions.
              </p>
            </Card>
          </div>
        </section>

        {/* CURRICULUM PREVIEW */}
        <section className="space-y-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="neutral" className="mb-2">
                Foundations Curriculum
              </Badge>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight text-[var(--canvas-text)]">
                Structured HTML & CSS Lessons
              </h2>
            </div>
            <Link
              href="/lessons"
              className="flex items-center gap-1.5 text-sm font-bold text-[#7091E6] transition-colors hover:text-[#ADBBDA]"
            >
              Explore Full Curriculum <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => {
              // Word count calculation: ~150 words per minute average technical reading speed
              const wordCount = lesson.body.trim().split(/\s+/).length;
              const readingTime = Math.max(2, Math.ceil(wordCount / 150));

              return (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className="group block"
                >
                  <Card
                    variant="interactive"
                    className="metallic-top-edge flex h-full flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-[var(--canvas-text-muted)]">
                        <Badge variant="primary">Lesson {lesson.order}</Badge>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {readingTime} min read
                        </span>
                      </div>
                      <CardTitle className="font-heading text-lg font-bold transition-colors group-hover:text-[#7091E6]">
                        {lesson.title}
                      </CardTitle>
                      <p className="line-clamp-2 text-sm text-[var(--canvas-text-secondary)]">
                        {lesson.summary}
                      </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-bold text-[#7091E6]">
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </Container>
    </main>
  );
}
