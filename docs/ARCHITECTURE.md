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
