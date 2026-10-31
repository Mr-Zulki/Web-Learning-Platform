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
