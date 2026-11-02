"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { ClientChallenge } from "@/lib/challenges";
import { checkSubmission, type CheckResult } from "@/lib/checker";
import { MarkdownContent } from "@/components/MarkdownContent";

export interface ChallengePanelProps {
  challenge: ClientChallenge;
  html: string;
  css: string;
  nextLesson?: { id: string; title: string } | null;
  onCheck?: (result: CheckResult) => void;
}

export function ChallengePanel({
  challenge,
  html,
  css,
  nextLesson,
  onCheck,
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
    if (onCheck) onCheck(result);

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
  }, [html, css, challenge, session?.user, onCheck]);

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
    <div className="space-y-space-lg">
      {/* Challenge Objective Card */}
      <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm space-y-space-md border border-surface-variant/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px]">target</span>
            <h2 className="font-title-md text-title-md text-on-surface font-semibold">
              {challenge.title}
            </h2>
          </div>
          <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-pill text-label-pill uppercase font-semibold">
            Active
          </span>
        </div>
        <div className="font-body-md text-body-md text-on-surface leading-6">
          <MarkdownContent content={challenge.task} />
        </div>
      </div>

      {/* FreeCodeCamp-style Tests Checklist */}
      <div className="space-y-space-sm pt-space-xs">
        <div className="flex items-center justify-between text-on-surface-variant mb-space-xs">
          <span className="font-label-pill text-label-pill uppercase font-semibold text-outline">
            Live Unit Assertions
          </span>
          <span className="font-label-code-sm text-label-code-sm text-primary font-semibold">
            {lastResult ? `${passedRules} of ${totalRules} Passed` : `${totalRules} Specifications`}
          </span>
        </div>

        <div className="space-y-space-sm">
          {challenge.rules.map((rule, idx) => {
            const ruleResult = lastResult?.results.find(
              (r) => r.ruleIndex === idx
            );
            const isEvaluated = Boolean(lastResult);
            const isPassed = ruleResult ? ruleResult.passed : false;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-space-sm px-space-md rounded-lg shadow-sm border transition-all duration-200 ${
                  !isEvaluated
                    ? "bg-surface-container-lowest border-surface-variant/40"
                    : isPassed
                      ? "bg-surface-container-lowest border-secondary/40 text-on-surface"
                      : "bg-error-container/20 border-error/40 text-on-surface"
                }`}
              >
                <div className="flex items-center gap-space-sm min-w-0 pr-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      !isEvaluated
                        ? "bg-surface-container-high text-outline"
                        : isPassed
                          ? "bg-secondary-fixed text-on-secondary-fixed"
                          : "bg-error text-on-error"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {!isEvaluated ? "more_horiz" : isPassed ? "check" : "close"}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm leading-snug">
                    {rule.message}
                  </span>
                </div>
                <span
                  className={`font-label-pill text-[10px] uppercase font-semibold shrink-0 ${
                    !isEvaluated
                      ? "text-outline"
                      : isPassed
                        ? "text-secondary"
                        : "text-error"
                  }`}
                >
                  {!isEvaluated ? "Pending" : isPassed ? "Passed" : "Failed"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progressive Hints Section */}
      {challenge.hints.length > 0 && (
        <div className="space-y-space-sm rounded-xl p-space-md bg-surface-container-low border border-surface-variant/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs text-primary font-title-md text-body-md font-semibold">
              <span className="material-symbols-outlined text-[18px] text-secondary">
                help_outline
              </span>
              <span>Hints ({revealedHints} of {challenge.hints.length} unlocked)</span>
            </div>
            {revealedHints < challenge.hints.length && (
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="text-body-sm text-secondary hover:text-primary font-semibold underline cursor-pointer"
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
                  className="rounded-lg border border-surface-variant/60 bg-surface-container-lowest p-3 text-body-sm text-on-surface"
                >
                  <span className="font-bold text-primary font-label-code-sm">
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-surface-variant/40 pt-space-md">
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={handleCheckCode}
            className="px-space-lg py-2.5 rounded-lg bg-gradient-to-r from-secondary to-primary text-on-primary font-title-md text-body-sm hover:shadow-md hover:shadow-secondary/20 transition-all flex items-center gap-space-xs shadow-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Check my code</span>
          </button>
          <div className="hidden sm:flex items-center gap-1 font-label-code-sm text-outline text-[11px]">
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
              Enter
            </kbd>
          </div>
        </div>

        {/* Live save indicator */}
        {session?.user && saveStatus !== "idle" && (
          <div className="flex items-center gap-1.5 font-label-code-sm text-body-sm">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-secondary animate-pulse">
                <span className="material-symbols-outlined text-[16px]">sync</span>
                Saving progress...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Progress saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-amber-600">Could not save progress.</span>
            )}
          </div>
        )}
      </div>

      {/* Results Banner with aria-live */}
      {lastResult && (
        <div aria-live="polite" className="mt-space-md">
          {lastResult.passed ? (
            <div className="p-space-lg rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-space-md">
              <div className="flex items-center gap-2 font-headline-sm text-headline-sm text-emerald-800">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <span>🎉 Great job! All checks passed!</span>
              </div>
              <p className="font-body-sm text-emerald-900 font-medium">
                {lastResult.score.passed} of {lastResult.score.total} checks passed.
              </p>
              {!session?.user && (
                <div className="p-space-md rounded-lg bg-white border border-emerald-200 text-body-sm text-on-surface">
                  <span className="font-bold">Log in to save your progress: </span>
                  <Link
                    href={`/login?next=/lessons/${challenge.lessonId}`}
                    className="text-primary font-semibold underline"
                  >
                    Log in or register
                  </Link>{" "}
                  to record this completion on your dashboard.
                </div>
              )}
              {nextLesson && (
                <div>
                  <Link
                    href={`/lessons/${nextLesson.id}`}
                    className="inline-flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-emerald-700 text-white font-title-md text-body-sm hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    <span>Continue to next lesson: {nextLesson.title} →</span>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-space-md rounded-lg bg-surface-container-high border border-outline-variant/60 text-on-surface flex items-center justify-between">
              <span className="font-body-sm font-semibold">
                {lastResult.score.passed} of {lastResult.score.total} checks passed. Check the assertion details above!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
