"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { ClientChallenge } from "@/lib/challenges";
import { checkSubmission, type CheckResult } from "@/lib/checker";
import { MarkdownContent } from "@/components/MarkdownContent";

export interface ChallengePanelProps {
  challenge: ClientChallenge;
  html: string;
  css: string;
  nextLesson?: { id: string; title: string } | null;
}

export function ChallengePanel({
  challenge,
  html,
  css,
  nextLesson,
}: ChallengePanelProps) {
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

  const handleCheckCode = useCallback(() => {
    // Note: Verification runs client-side in Phase 3.
    // Phase 4 will also verify server-side before persisting user progress.
    const result = checkSubmission({ html, css }, challenge);
    setLastResult(result);
  }, [html, css, challenge]);

  const handleRevealNextHint = () => {
    if (revealedHints < challenge.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  };

  return (
    <section
      aria-label="Challenge Panel"
      className="rounded-xl border border-slate-300 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
            Interactive Challenge
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {challenge.title}
          </h2>
        </div>
      </div>

      <div className="mt-4">
        <MarkdownContent content={challenge.task} />
      </div>

      {/* Progressive Hints Section */}
      {challenge.hints.length > 0 && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Hints ({revealedHints} of {challenge.hints.length} unlocked)
            </h3>
            {revealedHints < challenge.hints.length && (
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="text-xs font-semibold text-amber-800 underline hover:text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:text-amber-400 dark:hover:text-amber-200"
              >
                Show hint {revealedHints + 1}
              </button>
            )}
          </div>

          {revealedHints > 0 && (
            <div className="mt-3 space-y-2">
              {challenge.hints.slice(0, revealedHints).map((hint, index) => (
                <div
                  key={index}
                  className="rounded-md bg-white/80 p-2.5 text-xs text-amber-950 shadow-xs dark:bg-slate-900 dark:text-amber-200"
                >
                  <span className="font-bold">Hint {index + 1}:</span> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleCheckCode}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Check my code
        </button>
      </div>

      {/* Results Region with aria-live */}
      {lastResult && (
        <div
          aria-live="polite"
          className="mt-6 rounded-lg border p-4 transition-all"
        >
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-bold">
              {lastResult.score.passed} of {lastResult.score.total} checks
              passed
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                lastResult.passed
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
              }`}
            >
              {lastResult.passed ? "All checks passed!" : "Needs work"}
            </span>
          </div>

          {/* Success Banner */}
          {lastResult.passed && (
            <div className="mt-4 rounded-md bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <p className="text-sm font-semibold">
                🎉 Great job! You successfully completed this challenge.
              </p>
              {nextLesson && (
                <div className="mt-3">
                  <Link
                    href={`/lessons/${nextLesson.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 underline hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-200"
                  >
                    Continue to next lesson: {nextLesson.title} →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Rule Evaluation Breakdown */}
          <ul className="mt-4 space-y-2">
            {lastResult.results.map((res) => (
              <li
                key={res.ruleIndex}
                className={`flex items-start gap-2.5 rounded-md p-3 text-xs transition ${
                  res.passed
                    ? "bg-slate-50 text-slate-700 dark:bg-slate-800/40 dark:text-slate-300"
                    : "border border-red-200 bg-red-50/70 font-medium text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200"
                }`}
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  aria-hidden="true"
                >
                  {res.passed ? "✓" : "✗"}
                </span>
                <span className="leading-relaxed">{res.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
