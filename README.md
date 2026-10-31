# uni-project — HTML/CSS Interactive Learning Platform

Students HTML aur CSS lessons parhte hain, live editor mein code likhte hain,
aur challenges auto-check hote hain.

## Features

- Lessons (HTML, CSS basics → layout → responsive)
- Live HTML/CSS editor with preview
- Challenges with automatic checking
- User auth aur progress tracking
- Load balanced deployment (Docker + Nginx)

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Docker (load balancing demo)

```bash
docker compose up --build --scale app=2
# http://localhost:8080
```

## Scripts

- `npm run dev` — development
- `npm test` — unit tests (Vitest)
- `npm run test:watch` — unit tests in watch mode
- `npm run test:coverage` — unit test coverage via v8
- `npm run test:e2e` — Playwright e2e
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript typecheck
- `npm run format:check` — Prettier format check

## Docs

Detail ke liye `docs/` folder dekho. LLM ke liye `AGENTS.md` parho.
