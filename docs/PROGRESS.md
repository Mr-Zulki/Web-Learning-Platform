# Progress

## Current phase: 7

## Done

- [x] Phase 0 — Project setup (Next.js scaffold, App Router, TypeScript strictness, Tailwind CSS, Prettier + ESLint, folder structure, .env.example, minimal home page)
- [x] Phase 1 — Lessons UI (Zod content schema, 5 beginner lessons, server-only lessons loader, /lessons list, /lessons/[id] detail with responsive sidebar, markdown renderer, pager, Phase 2 editor placeholder, 100% src/lib test coverage)
- [x] Phase 2 — Live editor and sandboxed preview (CodeMirror 6 integration, preview document builder with CSP and breakout escape, 300ms debounce, HTML/CSS tabs, localStorage draft persistence, mobile Lesson/Editor/Preview tabs, 100% src/lib test coverage)
- [x] Phase 3 — Challenges and automatic checking (Zod challenge schema, 5 challenges matching lessons, server loader with loud bi-directional cross-validation, pure static analysis checker via parse5 and css-tree, 7 rule evaluators, ChallengePanel UI with progressive hints, mobile Challenge tab, sessionStorage challenge completion caching, >95% src/lib/checker coverage)
- [x] Phase 4 — Database, authentication, and progress tracking (PostgreSQL 16 docker-compose, Prisma schema with User, Progress, and RateLimit, Auth.js credentials provider with cost 12 bcrypt, stateless JWT sessions, DB-backed atomic rate limiting, server-side re-check of submissions, authenticated learner dashboard, integration tests against uni_test DB)
- [x] Phase 5 — Full Dockerization & reverse proxy (multi-stage Docker build under 151MB, non-root nextjs user, Nginx reverse proxy load balancer with round-robin and passive failover on port 8080, production docker-compose with PostgreSQL 16 and one-off migrate job, liveness/readiness probes, dynamic X-Served-By header, k6 smoke testing suite, PowerShell lb-check and failover verification scripts)
- [x] Phase 6 — Load resilience and external-test readiness (asynchronous crypto.scrypt password hashing off the event loop via libuv pool 16 with backward-compatible bcrypt migration, dual rate-limit profiles strict vs demo, Nginx 60s micro-caching on static curriculum reducing p95 latency from 6.95s to 8.96ms, keepalive 64 pooling, database connection budget with max_connections 150, 5 baseline and after-fix k6 scenarios, Playwright E2E happy path, 8/8 automated chaos checks passed, GitHub Actions CI workflow with 5 jobs)

## Next

- Phase 7 — UI redesign (modern Tailwind UI polish, responsive dashboard, enhanced styling)

## Blockers

- none
