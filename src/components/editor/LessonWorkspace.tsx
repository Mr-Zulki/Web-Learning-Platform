"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { BookOpen, Code2, Eye, Award } from "lucide-react";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { MAX_CODE_LENGTH } from "@/lib/preview";
import type { ClientChallenge } from "@/lib/challenges";
import type { CheckResult } from "@/lib/checker";
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
  const [lastResult, setLastResult] = useState<CheckResult | null>(null);

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
    <section className="bg-[#121624] text-[#E0E6F8] rounded-xl shadow-md flex flex-col overflow-hidden h-full border border-[#252D4A]">
      <EditorTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCopy={handleCopy}
      />
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className="flex-1 min-h-[350px] overflow-hidden bg-[#121624]"
      >
        <CodeEditor
          language={activeTab}
          value={activeTab === "html" ? html : css}
          onChange={activeTab === "html" ? setHtml : setCss}
          ariaLabel={`Interactive ${activeTab.toUpperCase()} Code Editor`}
        />
      </div>
      <EditorToolbar
        activeTab={activeTab}
        currentLength={currentLength}
        maxLength={MAX_CODE_LENGTH}
        isModified={isModified}
        onCopy={handleCopy}
      />
    </section>
  );

  const previewSection = (
    <PreviewFrame
      html={debouncedHtml}
      css={debouncedCss}
      lastResult={lastResult}
    />
  );

  const challengeSection = challenge ? (
    <ChallengePanel
      challenge={challenge}
      html={html}
      css={css}
      nextLesson={nextLesson}
      onCheck={(res) => setLastResult(res)}
    />
  ) : null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-surface-container-low">
      {/* Top Workspace Sub-Bar matching reference */}
      <div className="w-full bg-surface-container-lowest px-space-md py-space-sm flex flex-wrap items-center justify-between gap-space-md shadow-sm border-b border-surface-variant/40">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <Link
              href="/lessons"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Roadmap
            </Link>
            <span className="material-symbols-outlined text-[16px] text-outline">
              chevron_right
            </span>
            <span className="font-title-md text-title-md text-on-surface font-semibold capitalize">
              {lessonId.replace(/-/g, " ")}
            </span>
          </div>
          <div className="h-4 w-px bg-surface-variant" />
          <div className="hidden lg:flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-pill text-label-pill uppercase font-semibold">
            <span className="material-symbols-outlined text-[14px]">flag</span>
            <span>Challenge 1 of 1</span>
          </div>
        </div>

        {/* Middle Track Progress Indicator */}
        <div className="hidden xl:flex items-center gap-space-sm w-56">
          <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-container via-secondary to-primary rounded-full"
              style={{ width: lastResult?.passed ? "100%" : "50%" }}
            />
          </div>
          <span className="font-label-code-sm text-label-code-sm text-on-surface-variant font-semibold">
            {lastResult?.passed ? "100%" : "50%"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            id="btn-reset"
            onClick={handleReset}
            className="px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-title-md text-body-sm transition-colors flex items-center gap-space-xs shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span className="hidden sm:inline">Reset Code</span>
          </button>

          {nextLesson && (
            <Link
              href={`/lessons/${nextLesson.id}`}
              className="px-space-md py-1.5 rounded-lg bg-primary-fixed text-on-primary-fixed hover:bg-secondary-fixed transition-colors font-title-md text-body-sm flex items-center gap-space-xs"
            >
              <span className="hidden sm:inline">Next Challenge</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Tabs (< 1024px) */}
      <div className="p-space-sm lg:hidden">
        <div
          role="tablist"
          aria-label="Lesson workspace navigation"
          className="grid grid-cols-4 gap-1 rounded-xl bg-surface-container-lowest p-1 shadow-sm border border-surface-variant/40"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "lesson"}
            onClick={() => setMobileTab("lesson")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
              mobileTab === "lesson"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Lesson</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "editor"}
            onClick={() => setMobileTab("editor")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
              mobileTab === "editor"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "preview"}
            onClick={() => setMobileTab("preview")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
              mobileTab === "preview"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "challenge"}
            onClick={() => setMobileTab("challenge")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
              mobileTab === "challenge"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Challenge</span>
          </button>
        </div>
      </div>

      {/* Mobile View: Render only active panel */}
      <div className="p-space-md lg:hidden flex-1">
        {mobileTab === "lesson" && (
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40">
            {children}
          </div>
        )}
        {mobileTab === "editor" && (
          <div className="min-h-[400px] h-full">{editorSection}</div>
        )}
        {mobileTab === "preview" && (
          <div className="min-h-[400px] h-full">{previewSection}</div>
        )}
        {mobileTab === "challenge" && (
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-variant/40">
            {challengeSection}
          </div>
        )}
      </div>

      {/* Desktop 3-Panel Split Grid Layout (>= 1024px) matching reference */}
      <div className="hidden lg:grid grid-cols-12 flex-1 p-space-md gap-space-md min-h-[calc(100vh-130px)]">
        {/* Left Panel: Directive Specs (Theory + Checklist) */}
        <section
          aria-label="Directive Specs"
          className="col-span-4 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden max-h-[calc(100vh-140px)] border border-surface-variant/40"
        >
          <div className="px-space-lg py-space-md bg-surface-container-low flex items-center justify-between border-b border-surface-variant/40">
            <div className="flex items-center gap-space-sm">
              <div className="p-1 rounded-md bg-primary-container text-on-primary">
                <span className="material-symbols-outlined text-[16px]">assignment</span>
              </div>
              <span className="font-title-md text-title-md text-primary tracking-tight font-bold">
                Directive Specs
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="px-space-sm py-0.5 rounded-full bg-surface-variant font-label-pill text-label-pill text-on-surface-variant uppercase">
                Core
              </span>
              <span className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-pill text-label-pill uppercase">
                Active
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-space-lg py-space-lg space-y-space-lg">
            {children}
            {challengeSection}
          </div>
        </section>

        {/* Center Panel: Code Editor */}
        <section
          aria-label="Code Editor"
          className="col-span-4 flex flex-col overflow-hidden max-h-[calc(100vh-140px)]"
        >
          {editorSection}
        </section>

        {/* Right Panel: Live Sandboxed Preview */}
        <section
          aria-label="Live Preview"
          className="col-span-4 flex flex-col overflow-hidden max-h-[calc(100vh-140px)]"
        >
          {previewSection}
        </section>
      </div>
    </div>
  );
}
