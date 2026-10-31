# Design

## Principles

- Simple, clean, focus on code and preview.
- Mobile responsive (min 360px).
- Dark mode default for editor, light for lessons (toggle optional).

## Tokens

- Primary: #2563EB
- Success: #16A34A
- Error: #DC2626
- Font: Inter (UI), JetBrains Mono (code)
- Spacing: 4px scale. Radius: 8px.

## Layout

- Lesson page: sidebar (lesson list) | content | editor+preview (split)
- Mobile: tabs (Lesson / Editor / Preview)

## Components

- LessonNav, LessonContent, CodeEditor, Preview, ChallengeCard, ProgressBar, AuthForm

## Accessibility

- Color contrast AA
- Keyboard navigation
- aria-labels on editor controls

## Phase 2 Editor & Preview Specifications

### Desktop Layout (>= 1024px)

- Multi-column arrangement:
  - Left column: Lesson instructions (prose typography, headers, lists, code samples) with bottom lesson pager.
  - Right column: Sticky workspace container stacking the CodeEditor (top) and PreviewFrame (bottom).
- CodeEditor styling: Dark theme (`oneDark` by default) with JetBrains Mono font, 320px minimum height, line numbers, and active line highlighting.
- PreviewFrame: Clean white canvas with status indicator header, 320px minimum height, and isolated sandboxed execution.

### Mobile Layout (< 1024px)

- Responsive 3-tab switcher: `Lesson | Editor | Preview` with `role="tablist"` and active pill indicator.
- Single-panel display: Only the currently active tab panel is rendered, preventing vertical stack overload and horizontal scrolling on narrow screens (tested down to 360px).
- Local tab state: Defaults to `Lesson` so students read theory first before jumping to code or preview.
