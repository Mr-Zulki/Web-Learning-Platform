import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
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

  return (
    <main className="relative flex flex-col items-center justify-center overflow-hidden py-12 lg:py-20">
      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-500/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-10 -z-10 h-[400px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]"
        aria-hidden="true"
      />

      <Container size="xl" className="space-y-24">
        {/* HERO SECTION */}
        <section className="flex flex-col items-center space-y-8 pt-4 text-center">
          <Badge variant="primary" dot className="px-3.5 py-1 text-xs">
            Interactive Web Development Curriculum
          </Badge>

          <div className="max-w-4xl space-y-5">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              HTML/CSS Interactive Learning Platform
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Master modern HTML and CSS fundamentals through hands-on lessons,
              live code previews, and automated static AST challenge
              verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/lessons">
              <Button
                size="lg"
                variant="primary"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Start learning →
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* REALISTIC CODE WORKSPACE MOCKUP */}
          <div className="w-full max-w-4xl pt-6">
            <div className="glass-panel-elevated overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              {/* Fake window header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/40 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    index.html — DevCraft Workspace
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>3 of 3 tests passed</span>
                </div>
              </div>

              {/* Code split mockup */}
              <div className="grid grid-cols-1 divide-y divide-white/10 bg-slate-950/60 text-left font-mono text-xs md:grid-cols-2 md:divide-x md:divide-y-0">
                {/* Editor side */}
                <div className="space-y-1.5 overflow-x-auto p-5 text-slate-300">
                  <div className="text-slate-500">
                    {"// 1. Write HTML & CSS in real-time"}
                  </div>
                  <div>
                    <span className="text-blue-400">&lt;div</span>{" "}
                    <span className="text-amber-300">class</span>=
                    <span className="text-emerald-300">&quot;card&quot;</span>
                    <span className="text-blue-400">&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">&lt;h1&gt;</span>
                    <span className="text-white">Hello, World!</span>
                    <span className="text-blue-400">&lt;/h1&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-400">&lt;p&gt;</span>
                    <span className="text-slate-300">
                      Building UI with precision.
                    </span>
                    <span className="text-blue-400">&lt;/p&gt;</span>
                  </div>
                  <div>
                    <span className="text-blue-400">&lt;/div&gt;</span>
                  </div>
                  <div className="pt-2 text-slate-500">
                    {"// 2. CSS with modern box-model"}
                  </div>
                  <div>
                    <span className="text-purple-400">.card</span> &#123;
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-blue-300">padding</span>:{" "}
                    <span className="text-amber-300">1.5rem</span>;
                  </div>
                  <div className="pl-4 text-slate-300">
                    <span className="text-blue-300">border-radius</span>:{" "}
                    <span className="text-amber-300">12px</span>;
                  </div>
                  <div>&#125;</div>
                </div>

                {/* Preview side */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                  <div className="w-full max-w-xs rounded-xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-md">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        Sandboxed Preview
                      </span>
                    </div>
                    <h3 className="mb-1 text-base font-bold text-white">
                      Hello, World!
                    </h3>
                    <p className="text-xs text-slate-400">
                      Building UI with precision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THREE CORE PILLARS */}
        <section className="space-y-12">
          <div className="space-y-3 text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Why Learn With This Platform
            </h2>
            <p className="mx-auto max-w-xl text-sm text-slate-400 sm:text-base">
              Engineered for genuine learning outcomes: immediate feedback,
              sandboxed isolation, and zero arbitrary guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card variant="base" className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Terminal className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Live CodeMirror Workspace
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Full-featured in-browser code editor with HTML & CSS syntax
                highlighting, auto-indentation, and local draft persistence.
              </p>
            </Card>

            <Card variant="base" className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Instant Sandboxed Preview
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Renders user HTML and CSS inside an isolated iframe with a
                strict Content Security Policy prohibiting outbound network
                calls.
              </p>
            </Card>

            <Card variant="base" className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Deterministic AST Checking
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                Parse5 and CSS-Tree static analysis engine validates exact
                HTML/CSS specifications with clear pass/fail checklist feedback.
              </p>
            </Card>
          </div>
        </section>

        {/* CURRICULUM PREVIEW */}
        <section className="space-y-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge variant="neutral" className="mb-2">
                Beginner Track
              </Badge>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Structured HTML & CSS Lessons
              </h2>
            </div>
            <Link
              href="/lessons"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
            >
              Explore all lessons <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/lessons/${lesson.id}`}
                className="group"
              >
                <Card
                  variant="interactive"
                  className="flex h-full flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-mono">Lesson {lesson.order}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.max(3, Math.ceil(lesson.body.length / 500))} min
                      </span>
                    </div>
                    <CardTitle className="transition-colors group-hover:text-blue-400">
                      {lesson.title}
                    </CardTitle>
                    <p className="line-clamp-2 text-sm text-slate-400">
                      {lesson.summary}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-2 text-xs font-medium text-blue-400">
                    <span>Open Lesson</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* TRUST & LOCAL EXECUTION */}
        <section className="glass-panel space-y-4 rounded-2xl border border-white/10 p-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>
              Stateless Architecture & Load-Balanced High Availability
            </span>
          </div>
          <p className="mx-auto max-w-2xl text-xs text-slate-400 sm:text-sm">
            All curriculum lessons and challenges run locally in Docker
            containers behind an Nginx reverse proxy with round-robin load
            balancing and sub-millisecond edge caching.
          </p>
        </section>
      </Container>
    </main>
  );
}
