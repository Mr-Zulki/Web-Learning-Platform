# API Reference

| Method | Route                      | Auth | Body                                                            | Response / Status                                    | Strict Rate Limit         | Demo Rate Limit              |
| ------ | -------------------------- | ---- | --------------------------------------------------------------- | ---------------------------------------------------- | ------------------------- | ---------------------------- |
| POST   | `/api/auth/register`       | no   | `{ email, password, name? }`                                    | `201 Created` (`{ user: { id, email, name, ... } }`) | 5 per hour per IP         | 1,000 per hour per IP        |
| POST   | `/api/auth/[...nextauth]`  | no   | NextAuth Credentials / Session form                             | `302 Redirect` (Sets httpOnly JWT cookie)            | 10 per 15 min per IP/user | 3,000 per 15 min per IP/user |
| GET    | `/api/progress`            | yes  | —                                                               | `200 OK` (`{ progress: [...], summary: {...} }`)     | —                         | —                            |
| POST   | `/api/progress`            | yes  | `{ lessonId, challengeId, status, submission?: { html, css } }` | `200 OK` (`{ progress: {...} }`)                     | 60 per min per user       | 600 per min per user         |
| GET    | `/api/lessons` (Deferred)  | no   | —                                                               | Statically prerendered in RSC                        | —                         | —                            |
| GET    | `/api/lessons/[id]` (Def.) | no   | —                                                               | Statically prerendered in RSC                        | —                         | —                            |

---

## Detailed Specifications

### 1. `POST /api/auth/register`

Creates a new learner account.

- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  - `email`: string (valid email format, trimmed and lowercased)
  - `password`: string (8–72 characters, distinct from email)
  - `name`: string (optional, 1–60 characters)
- **Status Codes**:
  - `201 Created`: User created successfully. Response body excludes password and passwordHash.
  - `400 Bad Request`: Validation failure on email/password constraints.
  - `409 Conflict`: Email already in use (`{ error: { code: "EMAIL_EXISTS" } }`).
  - `415 Unsupported Media Type`: Non-JSON request body.
  - `429 Too Many Requests`: Registration limit exceeded (5 registrations/hour/IP).

### 2. `POST /api/auth/[...nextauth]` (Credentials Provider)

Authenticates a user and issues an encrypted JWT session cookie.

- **Request Headers**: Form encoded or standard NextAuth sign-in request
- **Credentials**:
  - `email`: user email
  - `password`: plain-text password
- **Behavior**:
  - Validates credentials against cost 12 bcrypt hash.
  - If user does not exist, runs constant-time dummy bcrypt verification to prevent user enumeration via timing analysis.
  - Dual rate-limited by client IP and email (10 attempts per 15 minutes).
  - Returns `httpOnly`, `SameSite=Lax`, 7-day session token cookie.

### 3. `GET /api/progress`

Retrieves all progress records and curriculum completion summary for the authenticated user.

- **Authentication**: Required (JWT cookie)
- **Status Codes**:
  - `200 OK`:
    ```json
    {
      "progress": [
        {
          "id": "cuid...",
          "lessonId": "html-structure",
          "challengeId": "challenge-html-structure",
          "status": "COMPLETED",
          "completedAt": "2026-10-31T...",
          "createdAt": "2026-10-31T...",
          "updatedAt": "2026-10-31T..."
        }
      ],
      "summary": {
        "completed": 1,
        "total": 5
      }
    }
    ```
  - `401 Unauthorized`: Not logged in.

### 4. `POST /api/progress`

Records initial progress (`STARTED`) or verifies and records completion (`COMPLETED`).

- **Authentication**: Required (JWT cookie)
- **Request Body**:
  - `lessonId`: string (must match an existing lesson)
  - `challengeId`: string (must match lesson's challengeId)
  - `status`: `"STARTED"` | `"COMPLETED"`
  - `submission`: optional object `{ html: string, css: string }` (mandatory when `status === "COMPLETED"`; max 50,000 characters total)
- **Behavior**:
  - **Server-Side Re-Check**: When `status === "COMPLETED"`, the server re-runs the Phase 3 static checker (`checkSubmission`) against the submission code. If any rule fails, the update is rejected with `422 Unprocessable Content`.
  - **Status Downgrade Prevention**: Once a challenge is `COMPLETED`, a `STARTED` payload will not overwrite or reset completion.
- **Status Codes**:
  - `200 OK`: Progress updated and persisted.
  - `400 Bad Request`: Payload validation error or challengeId does not match lessonId.
  - `401 Unauthorized`: Not logged in.
  - `413 Payload Too Large`: Submission code exceeds 50,000 characters.
  - `422 Unprocessable Content`: Submission failed server-side rule verification. Returns detailed evaluation results and score.
  - `429 Too Many Requests`: Rate limit exceeded (60 progress updates/minute/user).

---

## Infrastructure & Cluster Monitoring (Phase 5)

All responses across the application include the `X-Served-By` header indicating the container hostname of the replica that handled the request:

```http
X-Served-By: 88eb565152a8
```

### 5. `GET /api/health` (Liveness Probe)

Lightweight process healthcheck verifying that the Next.js standalone process is active and responsive.

- **Authentication**: Public
- **Headers Returned**: `X-Served-By: <container-id>`
- **Status Codes**:
  - `200 OK`:
    ```json
    {
      "status": "ok",
      "instance": "88eb565152a8",
      "uptimeSeconds": 142
    }
    ```

### 6. `GET /api/ready` (Readiness Probe)

Deep dependency probe verifying database connectivity before routing user traffic. Executes `SELECT 1` with a 2-second timeout.

- **Authentication**: Public
- **Headers Returned**: `X-Served-By: <container-id>`
- **Status Codes**:
  - `200 OK`: Database connected and ready to accept queries.
    ```json
    {
      "status": "ready"
    }
    ```
  - `503 Service Unavailable`: Database unreachable or connection timed out (no internal error leakage).
    ```json
    {
      "status": "not ready"
    }
    ```

### 7. Rate Limit Error Responses (HTTP 429)

When rate limits are exceeded (at Nginx edge or inside Next.js application layer), the server returns a structured `429 Too Many Requests` JSON response:

- **Headers**: `Retry-After: <seconds>`, `Content-Type: application/json`
- **Application Layer JSON Schema**:
  ```json
  {
    "error": {
      "code": "RATE_LIMITED",
      "message": "Too many requests. Please try again later.",
      "retryAfter": 3600
    }
  }
  ```
- **Edge Nginx JSON Schema** (when blocked at reverse proxy perimeter):
  ```json
  {
    "error": {
      "code": "RATE_LIMITED",
      "message": "Too many requests. Please slow down and try again later."
    }
  }
  ```

---

## Phase 1 Implementation Note

Lessons are loaded directly on the server via React Server Components (`src/lib/lessons.ts` with `server-only`) and static generation (`generateStaticParams`). Standalone HTTP read endpoints `/api/lessons` remain unnecessary as RSC handles routing natively.
