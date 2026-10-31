# Changelog

## [Unreleased]

- Phase 3: Challenges and automatic checker implemented (strict Zod challenge schema with discriminated rule union, 5 lesson-aligned challenges in src/content/challenges, loud bi-directional cross-validation in server loader, pure static checker via parse5 and css-tree supporting 7 rule types and zero-unit/color normalization, ChallengePanel UI with progressive hint disclosure, next-lesson navigation, sessionStorage completion caching, mobile 4-tab workspace layout, known-good solutions in tests/fixtures/solutions, and Vitest suite with >95% src/lib/checker coverage).
- Phase 2: Live editor and sandboxed preview implemented (CodeMirror 6 with HTML/CSS modes and oneDark theme, pure-function preview builder with strict CSP and style breakout protection, 300ms debouncing, draft persistence via localStorage, accessible keyboard navigation, responsive mobile tabs, and sandbox threat model documentation).
- Phase 1: Lessons UI & content loader implemented (Zod schema validation, 5 foundational HTML/CSS lessons, server-only file loader with duplicate checks, responsive /lessons list and /lessons/[id] detail pages, Markdown renderer, navigation pager, Phase 2 editor placeholder, and Vitest suite with >=90% coverage).
- Phase 0: Project setup completed (Next.js App Router, TypeScript strict flags, Tailwind CSS tokens, ESLint + Prettier tooling, directory structure, .env.example, and initial verification).
- Project docs created.
