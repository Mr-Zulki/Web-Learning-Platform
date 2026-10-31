# AGENTS.md — LLM Context (ye file har session mein parho)

## Project

HTML/CSS interactive learning platform. Students lessons parhte hain,
live editor mein code likhte hain, challenges solve karte hain, progress save hoti ha.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- PostgreSQL + Prisma ORM
- Auth: Auth.js (credentials)
- Tests: Vitest (unit), Playwright (e2e)
- Local infra: Docker Compose (app x2 replicas + Nginx load balancer + Postgres)

## Rules for every change

1. Pehle docs/PHASES.md aur docs/PROGRESS.md parho. Current phase ka kaam karo.
2. Koi bhi naya feature docs/PRD.md se match karna chahiye. Scope se bahar kaam mat karo.
3. Code TypeScript strict mode mein likho. `any` avoid karo.
4. Har feature ke saath test likho (unit ya e2e).
5. User code sirf sandboxed iframe mein run ho. Parent page ka DOM ya cookies access nahi.
6. Secrets sirf .env mein. Kabhi code mein hardcode nahi.
7. Kaam khatam hone par ZAROOR update karo:
   - docs/PROGRESS.md (kya done, kya baqi)
   - docs/CHANGELOG.md (kya badla)
   - docs/ARCHITECTURE.md / API.md / DATA_MODEL.md agar structure badla ho
   - docs/DECISIONS.md agar koi tech decision liya ho
8. Koi bhi decision jo docs se alag ho to pehle docs update karo, phir code.

## Folder map

src/app/ → pages & API routes
src/components/ → UI components
src/lib/ → helpers (db, auth, sandbox checker)
src/content/ → lessons & challenges (JSON)
prisma/ → schema
tests/ → unit + e2e
docker/ → Dockerfile, nginx.conf

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
