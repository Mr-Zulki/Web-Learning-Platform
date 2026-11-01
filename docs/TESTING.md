# Testing Strategy & Guidelines

## Overview

The platform uses **Vitest** with the `@testing-library/react` and `jsdom` environment for unit and component testing, and **v8** for coverage collection. All tests reside in `tests/unit/`.

Run the test suite:

```bash
npm test                 # Run all unit tests
npm run test:watch       # Interactive watch mode
npm run test:coverage    # Generate v8 test coverage report
npm run test:integration # Run integration tests against PostgreSQL uni_test
```

---

## Integration Testing & Database Isolation (Phase 4)

Integration tests verify end-to-end authentication, database migrations, rate limiting, and progress APIs against an actual PostgreSQL instance without mocking Prisma or SQL queries.

### Test Environment Setup

- The local development container `docker-compose.dev.yml` provisions PostgreSQL 16 Alpine.
- An initialization script `docker/init-db.sql` automatically creates two separate databases on startup:
  1. `uni_dev`: The primary database used during development (`npm run dev`).
  2. `uni_test`: An isolated database reserved exclusively for integration test execution.
- Migrations are applied to both databases:
  ```bash
  # Start the database container
  npm run db:up

  # Apply Prisma migrations to the test database
  TEST_DATABASE_URL="postgresql://postgres:postgres_dev_password@127.0.0.1:5432/uni_test?schema=public" npx prisma migrate deploy
  ```

### Running Integration Tests

Execute the integration test suite:

```bash
npm run test:integration
```

The test configuration in `vitest.integration.config.ts`:

- Sets the `DATABASE_URL` environment variable to target `uni_test`.
- Uses Node.js test environment with timeout tolerance for database roundtrips (20,000ms).
- Cleans up modified tables (`User`, `Progress`, `RateLimit`) before each test suite to ensure strict test isolation.

### Integration Test Coverage (`tests/integration/phase4.test.ts`)

1. **User Registration & Password Hashing**: Verifies that new accounts are persisted with cost 12 bcrypt hashes and that passwords are never returned in API responses.
2. **Duplicate Prevention**: Asserts that registration attempts with existing emails return `409 Conflict`.
3. **Rate Limiting**: Confirms that rapid registration attempts trigger `429 Too Many Requests`.
4. **Authentication Protection**: Asserts that unauthenticated calls to `/api/progress` return `401 Unauthorized`.
5. **Progress Lifecycle**: Confirms saving `STARTED` status, retrieving summary statistics, and updating timestamps.
6. **Server Re-Check Verification**: Asserts that sending `COMPLETED` with an invalid solution is rejected with `422 Unprocessable Content`.
7. **Known-Good Solution Verification**: Asserts that submitting a known-good Phase 3 solution successfully marks the challenge `COMPLETED`.
8. **Cascade Deletion**: Confirms that deleting a `User` cascades to cleanly delete all associated `Progress` records.

---

## Static Analysis Checker Testing Strategy

The challenge verification engine in `src/lib/checker/` is tested through multiple layered test suites:

1. **HTML Query Suite (`tests/unit/html-query.test.ts`)**:
   - Selector matching for tag (`h1`), class (`.desc`), ID (`#banner`), and tag with class (`p.special`).
   - Attribute extraction and case handling.
   - Text extraction across nested children.
   - Hierarchy traversal (`isChildOf`) validating ancestor/descendant relationships.
   - Graceful handling of malformed markup (`<div class=broken><p unclosed>>>>`).
   - Complexity limit enforcement triggering safely when node count exceeds `MAX_DOM_NODES` (5,000 nodes).

2. **CSS Query Suite (`tests/unit/css-query.test.ts`)**:
   - CSS AST parsing using `css-tree`.
   - Multi-declaration extraction and selector matching.
   - Value normalization:
     - Hex colors: `#FFF` → `#ffffff`
     - Zero units: `0px`, `0em`, `0rem`, `0%` → `0`
     - Whitespace and quotes stripping: `"Inter", sans-serif` → `Inter, sans-serif`.
   - Fault-tolerant parsing ignoring invalid CSS syntax without throwing errors.

3. **Rule Evaluators Suite (`tests/unit/rules.test.ts`)**:
   - Comprehensive unit testing for each of the 7 supported rule types:
     - `element-exists`
     - `element-count`
     - `text-contains`
     - `attribute-equals`
     - `attribute-exists`
     - `css-property`
     - `child-of`
   - Verifies both passing and failing assertions and confirms informative failure messages.

4. **Checker Integration Suite (`tests/unit/checker.test.ts`)**:
   - **Known-Good Solutions**: Iterates over all 5 challenges and verifies that each solution in `tests/fixtures/solutions/*.json` achieves a 100% pass score.
   - **Empty Submissions**: Verifies that empty submissions fail safely with explicit rule breakdown.
   - **Partial Submissions**: Verifies that partially completed solutions report exact failing messages.
   - **Garbage & Malformed Input**: Asserts that broken or nonsensical markup does not throw exceptions or crash.
   - **Size Limits**: Asserts that inputs exceeding `MAX_CODE_LENGTH` (50,000 characters) fail immediately without memory spikes.
   - **Pathological Nesting**: Asserts that inputs exceeding `MAX_DOM_NODES` (5,000 nodes) are cleanly rejected.

5. **Challenge Schema & Loader Suites (`tests/unit/challenge-schema.test.ts`, `tests/unit/challenges.test.ts`)**:
   - Validates that malformed or incomplete challenge JSON is rejected loudly at startup.
   - Bi-directional cross-validation: verifies that an unreferenced challenge or an orphan lesson reference throws a loud error.
   - Solution confidentiality: verifies that known-good solutions are never attached to client challenge models.

6. **UI Component Tests (`tests/unit/ChallengePanel.test.tsx`, `tests/unit/LessonWorkspace.test.tsx`)**:
   - Progressive disclosure of hints one by one until exhausted.
   - Immediate feedback upon clicking "Check my code" with accessible `aria-live="polite"` feedback.
   - Rendering of next-lesson navigation links upon passing (omitted on the final lesson).
   - Local `sessionStorage` caching of completed challenge state.

---

## How to Add a New Challenge

Follow these four steps to create and verify a new challenge:

### Step 1: Create the Challenge JSON

Create a new file in `src/content/challenges/` named `challenge-<lesson-id>.json`. Ensure it satisfies `ChallengeSchema`:

```json
{
  "id": "challenge-my-topic",
  "lessonId": "my-topic",
  "title": "Build a Custom Card",
  "task": "Create a `<div>` with class `card` containing an `<h2>` title and a `<p>` description.",
  "hints": [
    "Start by writing `<div class=\"card\">`.",
    "Place an `<h2>` element inside the card."
  ],
  "rules": [
    {
      "type": "element-exists",
      "selector": "div.card",
      "min": 1,
      "message": "Create a <div> with class \"card\"."
    },
    {
      "type": "child-of",
      "selector": "h2",
      "parent": "div.card",
      "message": "Place an <h2> heading inside the .card container."
    }
  ]
}
```

### Step 2: Link the Challenge from the Lesson

In `src/content/lessons/<lesson-id>.json`, set the `challengeId` property to match your challenge's `id`:

```json
{
  "id": "my-topic",
  "title": "My Topic",
  "order": 6,
  "challengeId": "challenge-my-topic",
  ...
}
```

### Step 3: Add Known-Good Solution Fixture

Create `tests/fixtures/solutions/challenge-<lesson-id>.json`. This file must contain an HTML/CSS combination that passes all defined rules:

```json
{
  "html": "<div class=\"card\"><h2>Title</h2><p>Description</p></div>",
  "css": ".card { padding: 16px; }"
}
```

> **Note**: Solution fixtures are exclusively stored in `tests/fixtures/solutions/` and are never imported into client-facing bundles.

### Step 4: Verify via Test Suite

Run the test suite to automatically validate the schema, execute bi-directional cross-validation, and verify the solution:

```bash
npm test
```

---

## Playwright End-to-End Testing (Phase 6)

The platform includes full-system browser automation testing via `@playwright/test` (`tests/e2e/happy-path.spec.ts`) targeting `http://localhost:8080`:

1. **User Journey Tested**:
   - Navigates to `/register` and creates a new learner account.
   - Handles auto-login or manual credentials authentication.
   - Redirects to `/dashboard` and confirms user profile presence.
   - Navigates to `/lessons/html-structure`.
   - Interacts with CodeMirror 6 editor, clears starter code, types known-good solution.
   - Clicks "Check my code" and asserts client-side success feedback (`All checks passed!`).
   - Asserts server persistence confirmation (`✓ Progress saved`).
   - Returns to `/dashboard` and asserts updated progress (`1 of 5 completed (20%)`) and `Completed` badge.
2. **Execution**:
   ```bash
   npm run test:e2e
   ```

---

## Load & Stress Testing (Phase 6)

Containerized k6 test suites located in `tests/load/` simulate real-world traffic profiles:

- `browse.js`: 200 Virtual Users navigating static pages and curriculum details.
- `auth.js`: 50 Virtual Users executing full registration and credentials sign-in workflows.
- `progress.js`: 30 Virtual Users performing continuous progress writes.
- `mixed.js`: 80 Virtual Users (70% browsing, 20% login, 10% progress updates).
- `spike.js`: 300 Virtual Users sudden traffic surge within 5 seconds.

See [LOAD_TESTING.md](file:///C:/Users/HP/Videos/uni-project/docs/LOAD_TESTING.md) for full execution options and baseline vs after comparison tables.

---

## Chaos, Abuse, & Resilience Verification (Phase 6)

An automated suite in `scripts/chaos-check.ps1` verifies the system's fault-tolerance boundaries:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/chaos-check.ps1
```

- **Checks Executed**:
  1. _Oversized Payload_: Rejects 300KB requests with structured `413 Payload Too Large` JSON.
  2. _Malformed JSON_: Rejects invalid syntax with `400 Bad Request`.
  3. _Unsupported Media Type_: Rejects non-JSON payloads with `415 Unsupported Media Type`.
  4. _Missing Fields Validation_: Zod schema catches missing keys with `400 Bad Request`.
  5. _SQL Injection & XSS_: Parameterized queries prevent SQL tampering; script tags stored safely as text without evaluation.
  6. _Concurrent Registration Race_: 50 simultaneous registrations with identical email produce exactly 1 `201 Created` and 49 `409 Conflict` (0 server errors).
  7. _Database Outage Simulation_: Pauses PostgreSQL; cached pages return 200, `/api/ready` returns 503, cluster recovers automatically upon unpause.
  8. _Slow Client (Slowloris)_: Holds TCP connection beyond `client_header_timeout` (5s); server terminates hung sockets without starving healthy clients.
