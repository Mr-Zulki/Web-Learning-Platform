# uni-project — HTML/CSS Interactive Learning Platform

Students HTML aur CSS lessons parhte hain, live editor mein code likhte hain,
aur challenges auto-check hote hain.

## Features

- Lessons (HTML, CSS basics → layout → responsive)
- Live HTML/CSS editor with preview
- Challenges with automatic checking
- User auth aur progress tracking
- Load balanced deployment (Docker + Nginx)

## Editor and sandbox

The platform features an in-browser live editor powered by CodeMirror 6 with HTML/CSS support, 300ms preview debounce, and localStorage draft persistence. Previews are rendered inside an isolated `<iframe>` configured with `sandbox="allow-scripts"` (strictly excluding `allow-same-origin`) and protected by a restrictive Content Security Policy (`connect-src 'none'`, etc.) to guarantee that learner code cannot access the parent DOM, storage, or network.

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Set AUTH_SECRET (generate with: npx auth secret or openssl rand -base64 32)

# 3. Start PostgreSQL container
npm run db:up

# 4. Run Prisma database migrations
npx prisma migrate dev

# 5. Start development server
npm run dev
```

## Environment Variables

| Variable            | Description                                                    | Example / Default                                                                   |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `DATABASE_URL`      | PostgreSQL connection string for development                   | `postgresql://postgres:postgres_dev_password@127.0.0.1:5432/uni_dev?schema=public`  |
| `TEST_DATABASE_URL` | PostgreSQL connection string for integration tests             | `postgresql://postgres:postgres_dev_password@127.0.0.1:5432/uni_test?schema=public` |
| `AUTH_SECRET`       | Secret key used to sign and encrypt Auth.js JWT session tokens | Generated via `npx auth secret` or `openssl rand -base64 32`                        |
| `POSTGRES_USER`     | PostgreSQL superuser for Docker container                      | `postgres`                                                                          |
| `POSTGRES_PASSWORD` | PostgreSQL superuser password for Docker container             | `postgres_dev_password`                                                             |
| `POSTGRES_DB`       | Default database initialized by PostgreSQL                     | `uni_dev`                                                                           |

## Database Management

The development environment includes a containerized PostgreSQL 16 database defined in `docker-compose.dev.yml`:

```bash
npm run db:up     # Start PostgreSQL on 127.0.0.1:5432
npm run db:logs   # View PostgreSQL logs
npm run db:down   # Stop PostgreSQL container
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

## Adding a challenge

Challenges are defined as static JSON files and checked statically with zero code execution:

1. **Create the challenge**: Add `src/content/challenges/challenge-<lesson-id>.json` with `id`, `lessonId`, `title`, `task`, `hints` (1-3 strings), and declarative `rules` (`element-exists`, `element-count`, `text-contains`, `attribute-equals`, `attribute-exists`, `css-property`, `child-of`).
2. **Link the lesson**: In `src/content/lessons/<lesson-id>.json`, set `"challengeId": "challenge-<lesson-id>"`. The server loader performs loud bi-directional cross-validation at startup to guarantee every lesson has a matching challenge.
3. **Add the solution fixture**: Create `tests/fixtures/solutions/challenge-<lesson-id>.json` containing `{ "html": "...", "css": "..." }`. Solutions are kept strictly in test fixtures and are never sent to the client.
4. **Verify**: Run `npm test` to verify schema validation and that your solution passes all checks.

See [`docs/TESTING.md`](docs/TESTING.md) for full checker documentation.

## Docs

Detail ke liye `docs/` folder dekho. LLM ke liye `AGENTS.md` parho.
