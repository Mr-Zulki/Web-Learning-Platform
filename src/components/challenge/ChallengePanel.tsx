"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CheckCircle2,
  XCircle,
  Circle,
  HelpCircle,
  Play,
  Sparkles,
  Save,
} from "lucide-react";
import type { ClientChallenge } from "@/lib/challenges";
import { checkSubmission, type CheckResult } from "@/lib/checker";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Kbd";

export interface ChallengePanelProps {
  challenge: ClientChallenge;
  html: string;
  css: string;
  nextLesson?: { id: string; title: string } | null;
  onCheck?: () => void;
}

export function ChallengePanel({
  challenge,
  html,
  css,
  nextLesson,
}: ChallengePanelProps) {
  const { data: session } = useSession();

  const [revealedHints, setRevealedHints] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = sessionStorage.getItem(`uni:challenge:hints:${challenge.id}`);
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [lastResult, setLastResult] = useState<CheckResult | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(
        `uni:challenge:result:${challenge.id}`
      );
      return raw ? (JSON.parse(raw) as CheckResult) : null;
    } catch {
      return null;
    }
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const hasNotifiedStartedRef = useRef(false);

  // Notify server of STARTED status once on lesson open for logged-in users
  useEffect(() => {
    if (session?.user && challenge.lessonId && !hasNotifiedStartedRef.current) {
      hasNotifiedStartedRef.current = true;
      const storageKey = `uni:progress:started:${challenge.lessonId}`;
      try {
        if (!sessionStorage.getItem(storageKey)) {
          sessionStorage.setItem(storageKey, "1");
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId: challenge.lessonId,
              challengeId: challenge.id,
              status: "STARTED",
            }),
          }).catch(() => {});
        }
      } catch {
        // Ignore storage exceptions
      }
    }
  }, [session?.user, challenge.lessonId, challenge.id]);

  // Persist revealed hints to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        `uni:challenge:hints:${challenge.id}`,
        revealedHints.toString()
      );
    } catch {
      // SessionStorage error ignored
    }
  }, [challenge.id, revealedHints]);

  // Persist last result to sessionStorage
  useEffect(() => {
    if (!lastResult) return;
    try {
      sessionStorage.setItem(
        `uni:challenge:result:${challenge.id}`,
        JSON.stringify(lastResult)
      );
    } catch {
      // SessionStorage error ignored
    }
  }, [challenge.id, lastResult]);

  const handleCheckCode = useCallback(async () => {
    const result = checkSubmission({ html, css }, challenge);
    setLastResult(result);

    if (result.passed) {
      if (session?.user) {
        setSaveStatus("saving");
        try {
          const res = await fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lessonId: challenge.lessonId,
              challengeId: challenge.id,
              status: "COMPLETED",
              submission: { html, css },
            }),
          });
          if (res.ok) {
            setSaveStatus("saved");
          } else {
            setSaveStatus("error");
          }
        } catch {
          setSaveStatus("error");
        }
      } else {
        setSaveStatus("idle");
      }
    } else {
      setSaveStatus("idle");
    }
  }, [html, css, challenge, session?.user]);

  // Keyboard shortcut Ctrl/Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleCheckCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCheckCode]);

  const handleRevealNextHint = () => {
    if (revealedHints < challenge.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  const totalRules = challenge.rules.length;
  const passedRules = lastResult?.score.passed ?? 0;

  return (
    <section
      aria-label="Challenge Panel"
      className="glass-panel space-y-6 rounded-2xl border border-white/10 p-5 shadow-xl sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="primary" dot>
              Interactive Challenge
            </Badge>
            {lastResult?.passed && <Badge variant="success">All passed</Badge>}
          </div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-white">
            {challenge.title}
          </h2>
        </div>
      </div>

      {/* Task Description */}
      <div className="glass-panel rounded-xl border border-white/5 bg-slate-950/30 p-4">
        <MarkdownContent content={challenge.task} />
      </div>

      {/* FreeCodeCamp-style Tests Checklist */}
      <div className="space-y-3">
        {/* Checklist header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
              Test Checklist
            </h3>
            {lastResult && (
              <span className="text-xs text-slate-400">
                ({passedRules}/{totalRules})
              </span>
            )}
          </div>
          {lastResult && (
            <span className="text-xs font-medium text-slate-400">
              Status: {passedRules}/{totalRules} verified
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar
          value={lastResult ? passedRules : 0}
          max={totalRules}
          variant={lastResult?.passed ? "success" : "primary"}
          size="sm"
        />

        {/* Rule items */}
        <div className="space-y-2 pt-1">
          {challenge.rules.map((rule, idx) => {
            const ruleResult = lastResult?.results.find(
              (r) => r.ruleIndex === idx
            );
            const isEvaluated = Boolean(lastResult);
            const isPassed = ruleResult ? ruleResult.passed : false;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl border p-3 text-xs transition-all duration-200 sm:text-sm ${
                  !isEvaluated
                    ? "glass-panel border-white/5 text-slate-300"
                    : isPassed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shadow-sm shadow-emerald-500/5"
                      : "border-red-500/30 bg-red-500/10 text-red-200 shadow-sm shadow-red-500/5"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {!isEvaluated ? (
                    <Circle className="h-4 w-4 text-slate-500" />
                  ) : isPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="leading-relaxed font-medium">
                    {rule.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progressive Hints Section */}
      {challenge.hints.length > 0 && (
        <div className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                Hints ({revealedHints} of {challenge.hints.length} unlocked)
              </h3>
            </div>
            {revealedHints < challenge.hints.length && (
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="text-xs font-semibold text-amber-400 underline hover:text-amber-300 focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:outline-none"
              >
                Show hint {revealedHints + 1}
              </button>
            )}
          </div>

          {revealedHints > 0 && (
            <div className="space-y-2 pt-1">
              {challenge.hints.slice(0, revealedHints).map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-amber-500/20 bg-slate-900/80 p-3 text-xs text-amber-200"
                >
                  <span className="font-bold text-amber-300">
                    Hint {index + 1}:
                  </span>{" "}
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-2">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleCheckCode}
            variant="primary"
            size="md"
            leftIcon={<Play className="h-4 w-4 fill-current" />}
            className="font-semibold shadow-lg shadow-blue-500/25"
          >
            Check my code
          </Button>
          <div className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
            <Kbd>Ctrl</Kbd>
            <span>+</span>
            <Kbd>Enter</Kbd>
          </div>
        </div>

        {/* Live save indicator */}
        {session?.user && saveStatus !== "idle" && (
          <div className="flex items-center gap-2 text-xs font-medium">
            {saveStatus === "saving" && (
              <span className="flex animate-pulse items-center gap-1.5 text-blue-400">
                <Save className="h-3.5 w-3.5 animate-spin" />
                Saving progress...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />✓ Progress saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-amber-400">
                Could not save progress to server. Please try again.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Region with aria-live */}
      {lastResult && (
        <div
          aria-live="polite"
          className="glass-panel space-y-4 rounded-xl border border-white/10 p-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm font-bold text-white">
              {lastResult.score.passed} of {lastResult.score.total} checks
              passed
            </span>
            <Badge variant={lastResult.passed ? "success" : "warning"} dot>
              {lastResult.passed ? "All checks passed!" : "Needs work"}
            </Badge>
          </div>

          {/* Success Banner */}
          {lastResult.passed && (
            <div className="space-y-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span>
                  🎉 Great job! You successfully completed this challenge.
                </span>
              </div>

              {/* Anonymous Visitor Prompt */}
              {!session?.user && (
                <div className="rounded-lg border border-emerald-500/20 bg-slate-900/80 p-3 text-xs text-slate-300">
                  <span className="font-semibold text-white">
                    Log in to save your progress
                  </span>
                  <p className="mt-1 text-slate-400">
                    You solved this challenge!{" "}
                    <Link
                      href={`/login?next=/lessons/${challenge.lessonId}`}
                      className="font-medium text-blue-400 underline hover:text-blue-300"
                    >
                      Log in or register
                    </Link>{" "}
                    to record this completion on your dashboard.
                  </p>
                </div>
              )}

              {/* Next Lesson CTA */}
              {nextLesson && (
                <div>
                  <Link
                    href={`/lessons/${nextLesson.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 underline hover:text-emerald-200"
                  >
                    <span>Continue to next lesson: {nextLesson.title} →</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
