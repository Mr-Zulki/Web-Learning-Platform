"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { MAX_CODE_LENGTH } from "@/lib/preview";
import type { ClientChallenge } from "@/lib/challenges";
import { EditorTabs, type EditorTabType } from "./EditorTabs";
import { EditorToolbar } from "./EditorToolbar";
import { PreviewFrame } from "./PreviewFrame";
import { CodeEditorSkeleton } from "./CodeEditorSkeleton";
import { ChallengePanel } from "@/components/challenge/ChallengePanel";

const CodeEditor = dynamic(
  () => import("./CodeEditor").then((mod) => mod.CodeEditor),
  {
    ssr: false,
    loading: () => <CodeEditorSkeleton />,
  }
);

export type MobileTab = "lesson" | "editor" | "preview" | "challenge";

export interface StarterCode {
  html: string;
  css: string;
}

export interface LessonWorkspaceProps {
  lessonId: string;
  starterCode: StarterCode;
  challenge?: ClientChallenge | null;
  nextLesson?: { id: string; title: string } | null;
  children?: ReactNode;
}

function getStoredDraft(lessonId: string, starter: StarterCode): StarterCode {
  if (typeof window === "undefined") {
    return starter;
  }
  try {
    const raw = localStorage.getItem(`uni:draft:${lessonId}`);
    if (!raw) return starter;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      "html" in parsed &&
      "css" in parsed &&
      typeof (parsed as { html: unknown }).html === "string" &&
      typeof (parsed as { css: unknown }).css === "string"
    ) {
      const validDraft = parsed as { html: string; css: string };
      if (
        validDraft.html.length <= MAX_CODE_LENGTH &&
        validDraft.css.length <= MAX_CODE_LENGTH
      ) {
        return {
          html: validDraft.html,
          css: validDraft.css,
        };
      }
    }
  } catch {
    // Gracefully ignore corrupt drafts or localStorage access errors
  }
  return starter;
}

export function LessonWorkspace({
  lessonId,
  starterCode,
  challenge,
  nextLesson,
  children,
}: LessonWorkspaceProps) {
  const [html, setHtml] = useState(
    () => getStoredDraft(lessonId, starterCode).html
  );
  const [css, setCss] = useState(
    () => getStoredDraft(lessonId, starterCode).css
  );
  const [activeTab, setActiveTab] = useState<EditorTabType>("html");
  const [mobileTab, setMobileTab] = useState<MobileTab>("lesson");

  // Save or clear draft in localStorage on changes
  useEffect(() => {
    try {
      if (html === starterCode.html && css === starterCode.css) {
        localStorage.removeItem(`uni:draft:${lessonId}`);
      } else {
        localStorage.setItem(
          `uni:draft:${lessonId}`,
          JSON.stringify({ html, css })
        );
      }
    } catch {
      // Storage quota or private browsing error ignored
    }
  }, [html, css, lessonId, starterCode]);

  // Debounced values for the preview frame (300ms)
  const debouncedHtml = useDebouncedValue(html, 300);
  const debouncedCss = useDebouncedValue(css, 300);

  const isModified = html !== starterCode.html || css !== starterCode.css;
  const currentLength = activeTab === "html" ? html.length : css.length;

  const handleReset = useCallback(() => {
    setHtml(starterCode.html);
    setCss(starterCode.css);
    try {
      localStorage.removeItem(`uni:draft:${lessonId}`);
    } catch {
      // Storage access error ignored
    }
  }, [lessonId, starterCode]);

  const handleCopy = useCallback(() => {
    const textToCopy = activeTab === "html" ? html : css;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).catch(() => {});
    }
  }, [activeTab, html, css]);

  const editorSection = (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-md">
      <EditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <EditorToolbar
        activeTab={activeTab}
        currentLength={currentLength}
        maxLength={MAX_CODE_LENGTH}
        isModified={isModified}
        onReset={handleReset}
        onCopy={handleCopy}
      />
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        <CodeEditor
          language={activeTab}
          value={activeTab === "html" ? html : css}
          onChange={activeTab === "html" ? setHtml : setCss}
          ariaLabel={`Interactive ${activeTab.toUpperCase()} Code Editor`}
        />
      </div>
    </div>
  );

  const previewSection = (
    <PreviewFrame html={debouncedHtml} css={debouncedCss} />
  );

  const challengeSection = challenge ? (
    <ChallengePanel
      challenge={challenge}
      html={html}
      css={css}
      nextLesson={nextLesson}
    />
  ) : null;

  return (
    <div className="min-w-0 flex-1">
      {/* Mobile Navigation Tabs (< 1024px) */}
      <div className="mb-6 lg:hidden">
        <div
          role="tablist"
          aria-label="Lesson workspace navigation"
          className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "lesson"}
            onClick={() => setMobileTab("lesson")}
            className={`rounded-md py-2 text-xs font-semibold transition ${
              mobileTab === "lesson"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Lesson
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "editor"}
            onClick={() => setMobileTab("editor")}
            className={`rounded-md py-2 text-xs font-semibold transition ${
              mobileTab === "editor"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "preview"}
            onClick={() => setMobileTab("preview")}
            className={`rounded-md py-2 text-xs font-semibold transition ${
              mobileTab === "preview"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "challenge"}
            onClick={() => setMobileTab("challenge")}
            className={`rounded-md py-2 text-xs font-semibold transition ${
              mobileTab === "challenge"
                ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Challenge
          </button>
        </div>
      </div>

      {/* Mobile View: Render only active panel */}
      <div className="lg:hidden">
        {mobileTab === "lesson" && <div className="min-w-0">{children}</div>}
        {mobileTab === "editor" && (
          <div className="min-w-0">{editorSection}</div>
        )}
        {mobileTab === "preview" && (
          <div className="min-w-0">{previewSection}</div>
        )}
        {mobileTab === "challenge" && (
          <div className="min-w-0">{challengeSection}</div>
        )}
      </div>

      {/* Desktop View (>= 1024px): 2-Column Split */}
      <div className="hidden items-start lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Left Column: Lesson Content & Pager */}
        <div className="min-w-0">{children}</div>

        {/* Right Column: Editor on top, Preview below, Challenge at bottom */}
        <div className="min-w-0 space-y-6">
          {editorSection}
          {previewSection}
          {challengeSection}
        </div>
      </div>
    </div>
  );
}
