# Architecture

## High level

Browser → Nginx (load balancer) → app replicas (Next.js) → PostgreSQL

## Modules

| Module     | Responsibility                                        |
| ---------- | ----------------------------------------------------- |
| lessons    | lesson content load, render, navigation               |
| editor     | HTML/CSS input, debounced preview in sandboxed iframe |
| challenges | task definition + automatic check                     |
| auth       | register, login, session                              |
| progress   | lesson/challenge completion per user                  |

## Request flow (challenge submit)

1. User editor mein code likhta ha.
2. "Submit" par code iframe mein render hota ha.
3. checker (src/lib/checker.ts) DOM/computed style check karta ha.
4. Result API `/api/progress` par save hota ha (auth required).

## Security

- iframe `sandbox="allow-scripts"` (no same-origin)
- Rate limit on auth routes
- Input validation (Zod) on all API routes
- Helmet-style headers via Next.js config

## Scaling (demo)

- Stateless app replicas. Session DB mein.
- Nginx round-robin across app replicas.

## Lessons Module (Phase 1)

- **Schema (`src/lib/lesson-schema.ts`)**: Zod-based schema validating `id` (kebab-case), `title`, `order` (positive int), `summary`, `body` (markdown), `starterCode` ({ html, css }), and `challengeId`. The TypeScript type `Lesson` is strictly inferred from this schema.
- **Loader (`src/lib/lessons.ts`)**: Server-side filesystem loader that reads JSON lesson files from `src/content/lessons`. Guarantees fail-loud parsing on missing/invalid fields and enforces unique IDs and order numbers.
- **Server-Only Guard**: Protected by the `"server-only"` boundary package, ensuring filesystem operations and raw content are never bundled into client-side JS bundles.
- **Static Generation (`generateStaticParams`)**: Lesson detail routes (`/lessons/[id]`) generate static HTML at build time for fast delivery and zero runtime filesystem latency.

## Editor & Preview Module (Phase 2)

- **Components**:
  - `CodeEditor`: Client-side wrapper around CodeMirror 6 with HTML/CSS language modes, One Dark theme, line numbers, line wrapping, and keyboard trap release (`Escape` then `Tab` leaves the editor). Loaded dynamically with `next/dynamic` (`ssr: false`) and a skeleton fallback.
  - `EditorTabs`: Accessible tablist (`role="tablist"`, `role="tab"`, `aria-selected`) with arrow-key and Home/End keyboard navigation.
  - `EditorToolbar`: Action controls including code reset (with confirmation on modification), clipboard copy, and character length counter against the 50,000 character limit.
  - `PreviewFrame`: Isolated preview container embedding a sandboxed `<iframe>` (`sandbox="allow-scripts"`).
  - `LessonWorkspace`: Coordinating client component managing code state, 300ms debounce, and draft persistence.
- **Data Flow & Debounce**:
  - Code changes in the editor update local component state immediately.
  - The preview pipeline consumes code through `useDebouncedValue` with a 300ms delay to eliminate excessive DOM repaints in the iframe while typing.
  - `buildPreviewDocument` parses the debounced input, escapes potential style-closing tags, applies the minimal reset CSS, injects the CSP meta tag as the first child of `<head>`, and outputs the complete document string for `srcDoc`.
- **Draft Persistence**:
  - Code is automatically persisted to `localStorage` under the key `uni:draft:<lessonId>`.
  - All storage operations are wrapped in `try/catch` to ensure quota or privacy mode errors fail silently without interrupting the user.
  - Saved drafts are validated for string types and max length on load; invalid drafts fall back safely to `starterCode`.
  - Resetting code restores `starterCode` and deletes the draft entry from `localStorage`.

## Sandbox Threat Model

- **What is allowed**:
  - JavaScript execution strictly inside the iframe context (`sandbox="allow-scripts"`).
  - Inline CSS styles and styling of the preview document (`style-src 'unsafe-inline'`).
  - Loading image and font assets over HTTPS or base64 data URIs (`img-src data: https:`, `font-src data: https:`).
- **What is blocked**:
  - Cross-frame DOM access: The parent page DOM (`parent.document`, `top.document`) cannot be read or modified because the sandboxed iframe has an opaque origin (`origin: null`).
  - Storage & Cookie access: The iframe cannot access `localStorage`, `sessionStorage`, `indexedDB`, or `document.cookie` belonging to the application origin.
  - Network requests to the application: The CSP directive `connect-src 'none'` forbids `fetch()`, `XMLHttpRequest`, `WebSocket`, or `EventSource` from initiating network calls anywhere, preventing exfiltration or API spoofing.
  - Navigation attacks: Top-level navigation is prohibited (`allow-top-navigation` is omitted), so user scripts cannot redirect the student away from the learning platform.
  - Form submission & Modals: Omission of `allow-forms`, `allow-modals`, and `allow-popups` prevents phishing prompts, alert loops, or rogue submissions.
- **Why `allow-same-origin` is strictly forbidden**:
  - If `allow-same-origin` were combined with `allow-scripts`, user-submitted JavaScript could access the host document, manipulate the application DOM, read auth tokens/cookies, or steal session state. By omitting `allow-same-origin`, browsers enforce an immutable origin separation.
- **Known limits & mitigations**:
  - Infinite loops (e.g. `while(true){}`) inside user script: The browser tab could hang. Future phases can explore worker execution or challenge-based script timeouts.
