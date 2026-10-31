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
