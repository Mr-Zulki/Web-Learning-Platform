# API

| Method | Route              | Auth | Body                            | Response      |
| ------ | ------------------ | ---- | ------------------------------- | ------------- |
| POST   | /api/auth/register | no   | {email, password, name}         | 201 user      |
| POST   | /api/auth/login    | no   | {email, password}               | 200 session   |
| GET    | /api/lessons       | no   | —                               | lesson list   |
| GET    | /api/lessons/[id]  | no   | —                               | lesson detail |
| POST   | /api/progress      | yes  | {lessonId, challengeId, status} | 200           |
| GET    | /api/progress      | yes  | —                               | user progress |
| GET    | /health            | no   | —                               | {status:"ok"} |

## Phase 1 Implementation Note

Lessons in Phase 1 are loaded and pre-rendered directly on the server via React Server Components (`src/lib/lessons.ts` with `server-only`) and static generation (`generateStaticParams`). The standalone HTTP endpoints `/api/lessons` and `/api/lessons/[id]` are deferred until external or client-side fetch requirements arise.
