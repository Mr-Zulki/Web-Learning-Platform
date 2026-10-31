# Decisions (ADR)

## 001 — Next.js + TypeScript

Why: full-stack ek repo, SSR, API routes, Vercel deploy easy.

## 002 — PostgreSQL + Prisma

Why: relational data (users, progress), type-safe queries.

## 003 — Docker Compose + Nginx for LB demo

Why: teacher ko local load balancing dikhani ha. Vercel par Nginx nahi chalta.

## 004 — Lessons as JSON

Why: content DB ki zarurat nahi, easy to edit aur version control.

## 005 — Prettier + ESLint Configuration

Why: Consistent code formatting and automated linting across the codebase. Uses Prettier with `prettier-plugin-tailwindcss` for class ordering and `eslint-config-prettier` to eliminate rule collisions.

## 006 — Strict TypeScript Compiler Options

Why: Enabled `strict: true`, `noUncheckedIndexedAccess: true`, and `noImplicitOverride: true` in tsconfig.json to catch missing properties, undefined array indexing, and inheritance errors at compile time before runtime.

## 007 — Zod-Validated JSON Content

Why: Guarantees strict runtime schema validation of all lesson files at load time, failing loudly on corrupt JSON or missing fields with informative error messages while exporting a single source-of-truth TypeScript type.

## 008 — react-markdown & remark-gfm for Lesson Rendering

Why: Provides lightweight, safe, component-level markdown rendering for lesson instructions without requiring dangerous innerHTML injections. Enables custom semantic components for typography and code blocks.

## 009 — Vitest for Unit and Component Testing

Why: Fast, modern test runner with native Vite/ESM support, jsdom environment for React Testing Library component tests, and integrated v8 coverage reports.

## 010 — Static Site Generation (`generateStaticParams`) for Lessons

Why: All lesson content is static JSON known at build time. Generating static HTML eliminates database or filesystem overhead at request time and ensures instant page transitions.

## 011 — CodeMirror 6 for In-Browser Code Editing

Why: Lightweight, modular, modern editor architecture supporting modular extensions (`@codemirror/lang-html`, `@codemirror/lang-css`), accessible keyboard trap releases, line wrapping, and customizable themes (`oneDark`).

## 012 — iframe `sandbox="allow-scripts"` Without `allow-same-origin`

Why: Strict sandbox separation. Omitting `allow-same-origin` ensures that user code runs under an opaque `null` origin, completely preventing access to the parent application's DOM, cookies, local storage, and session tokens.

## 013 — Content Security Policy (CSP) Injected into `srcDoc`

Why: Prohibits outbound network communication (`connect-src 'none'`), form submission (`form-action 'none'`), and base URI modification (`base-uri 'none'`). Ensures scripts cannot exfiltrate data or initiate requests back to the application origin.

## 014 — LocalStorage for Draft Persistence

Why: Seamless learner experience preserving uncommitted work across page reloads under `uni:draft:<lessonId>`. All accesses are safely wrapped in try/catch to protect against storage quota failures or incognito restrictions.

## 015 — Static AST Parsing over Code Execution

Why: Executing student code or inspecting live preview DOM/styles introduces severe security vulnerabilities, potential infinite loop hangs, race conditions with iframe rendering, and environment mismatches. Parsing HTML and CSS statically as pure data structures ensures zero arbitrary code execution, deterministic evaluation, and identical execution across browser client and server runtime.

## 016 — parse5 and css-tree for Static Parsing

Why: `parse5` is a fast, spec-compliant HTML5 parser that constructs an AST without requiring browser DOM emulation (such as jsdom or DOMParser), allowing universal execution across Node.js server, client components, and Vitest. `css-tree` delivers precise CSS AST parsing, declaration walking, and serialization without running stylesheets.

## 017 — Declarative Rule-Based Challenge Definitions

Why: Expressing challenge criteria as structured, declarative rules (`element-exists`, `element-count`, `text-contains`, `attribute-equals`, `attribute-exists`, `css-property`, `child-of`) provides granular per-requirement feedback to students, clean separation between logic and content, strict schema validation via Zod, and straightforward challenge authoring in JSON.

## 018 — Client-Side Instant Feedback with Planned Phase 4 Server Re-Check

Why: Instant feedback is critical for the learning experience, so the pure static checker runs client-side inside `ChallengePanel` without network round-trip delay. To prevent progress tampering or client spoofing, the same pure checker function will be invoked on the server in Phase 4 prior to writing verified completions to PostgreSQL.
