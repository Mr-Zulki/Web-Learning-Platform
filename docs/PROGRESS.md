# Progress

## Current phase: 5

## Done

- [x] Phase 0 — Project setup (Next.js scaffold, App Router, TypeScript strictness, Tailwind CSS, Prettier + ESLint, folder structure, .env.example, minimal home page)
- [x] Phase 1 — Lessons UI (Zod content schema, 5 beginner lessons, server-only lessons loader, /lessons list, /lessons/[id] detail with responsive sidebar, markdown renderer, pager, Phase 2 editor placeholder, 100% src/lib test coverage)
- [x] Phase 2 — Live editor and sandboxed preview (CodeMirror 6 integration, preview document builder with CSP and breakout escape, 300ms debounce, HTML/CSS tabs, localStorage draft persistence, mobile Lesson/Editor/Preview tabs, 100% src/lib test coverage)
- [x] Phase 3 — Challenges and automatic checking (Zod challenge schema, 5 challenges matching lessons, server loader with loud bi-directional cross-validation, pure static analysis checker via parse5 and css-tree, 7 rule evaluators, ChallengePanel UI with progressive hints, mobile Challenge tab, sessionStorage challenge completion caching, >95% src/lib/checker coverage)
- [x] Phase 4 — Database, authentication, and progress tracking (PostgreSQL 16 docker-compose, Prisma schema with User, Progress, and RateLimit, Auth.js credentials provider with cost 12 bcrypt, stateless JWT sessions, DB-backed atomic rate limiting, server-side re-check of submissions, authenticated learner dashboard, integration tests against uni_test DB)

## Next

- Phase 5 — Full Dockerization & reverse proxy (multi-replica Next.js, Nginx load balancer, production Docker Compose)

## Blockers

- none
