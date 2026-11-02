"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { Group, Panel, Separator } from "react-resizable-panels";
import { BookOpen, Code2, Eye, Award } from "lucide-react";
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
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 shadow-xl">
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
        className="min-h-[350px] flex-1 bg-[var(--code-bg)]"
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
    <div className="w-full min-w-0 flex-1">
      {/* Mobile Navigation Tabs (< 1024px) */}
      <div className="mb-6 lg:hidden">
        <div
          role="tablist"
          aria-label="Lesson workspace navigation"
          className="glass-panel-elevated grid grid-cols-4 gap-1 rounded-xl border border-[var(--border-glass)] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "lesson"}
            onClick={() => setMobileTab("lesson")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold transition ${
              mobileTab === "lesson"
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-md shadow-[#3D52A0]/20"
                : "text-[var(--canvas-text-secondary)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
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
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-md shadow-[#3D52A0]/20"
                : "text-[var(--canvas-text-secondary)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
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
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-md shadow-[#3D52A0]/20"
                : "text-[var(--canvas-text-secondary)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
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
                ? "bg-[#3D52A0] text-[#EDE8F5] shadow-md shadow-[#3D52A0]/20"
                : "text-[var(--canvas-text-secondary)] hover:bg-white/10 hover:text-[var(--canvas-text)]"
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Challenge</span>
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

      {/* Desktop View (>= 1024px): 3-Pane Resizable Layout */}
      <div className="hidden h-[calc(100vh-7rem)] w-full lg:block">
        <Group orientation="horizontal" className="flex h-full w-full">
          {/* Left Panel: Instructions + Challenge Checklist */}
          <Panel
            defaultSize={34}
            minSize={25}
            maxSize={45}
            className="h-full overflow-y-auto pr-2"
          >
            <div className="space-y-6 pr-1 pb-12">
              {children}
              {challengeSection}
            </div>
          </Panel>

          <Separator className="mx-1 my-2 flex w-2 shrink-0 cursor-col-resize items-center justify-center rounded-full bg-[var(--border-glass)] transition-colors hover:bg-[#7091E6]/40 active:bg-[#7091E6]/60">
            <div className="h-6 w-0.5 rounded-full bg-[var(--brand-steel)]/40" />
          </Separator>

          {/* Center Panel: Code Editor */}
          <Panel
            defaultSize={36}
            minSize={25}
            className="flex h-full flex-col px-2"
          >
            {editorSection}
          </Panel>

          <Separator className="mx-1 my-2 flex w-2 shrink-0 cursor-col-resize items-center justify-center rounded-full bg-[var(--border-glass)] transition-colors hover:bg-[#7091E6]/40 active:bg-[#7091E6]/60">
            <div className="h-6 w-0.5 rounded-full bg-[var(--brand-steel)]/40" />
          </Separator>

          {/* Right Panel: Sandboxed Preview */}
          <Panel
            defaultSize={30}
            minSize={20}
            className="flex h-full flex-col pl-2"
          >
            {previewSection}
          </Panel>
        </Group>
      </div>
    </div>
  );
}
