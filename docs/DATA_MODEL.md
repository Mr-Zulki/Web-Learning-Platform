# Data Model (Prisma)

Lessons & challenges are JSON files in `src/content/` (not DB) for fast static compilation and version control.

The relational database (PostgreSQL 16) manages users, their progress, and distributed rate limiting across instances.

## Models

### User

Stores learner credentials and profile information.

- `id`: String (`@id @default(cuid())`)
- `email`: String (`@unique`) — normalized to lowercase and trimmed before storage
- `passwordHash`: String — asynchronous `crypto.scrypt` versioned hash formatted as `scrypt$N$r$p$saltHex$derivedKeyHex` (N=16384, r=8, p=1, keyLength=64, saltLength=16). Transparently supports backward-compatible legacy bcrypt hashes, upgrading them automatically to scrypt upon successful authentication.
- `name`: String? — learner display name
- `createdAt`: DateTime (`@default(now())`)
- `updatedAt`: DateTime (`@updatedAt`)
- `progress`: Progress[] — relation to progress records with `onDelete: Cascade`

### Progress

Tracks lesson and challenge completion for authenticated users.

- `id`: String (`@id @default(cuid())`)
- `userId`: String — foreign key to `User.id`
- `lessonId`: String — identifier of the lesson (`kebab-case`)
- `challengeId`: String — identifier of the challenge (non-nullable; 1:1 with lesson in Phase 4)
- `status`: ProgressStatus enum (`STARTED` | `COMPLETED`)
- `completedAt`: DateTime? — timestamp when challenge was successfully passed on the server
- `createdAt`: DateTime (`@default(now())`)
- `updatedAt`: DateTime (`@updatedAt`)
- `user`: User — relation (`fields: [userId], references: [id], onDelete: Cascade`)

**Constraints and Indexes**:

- `@@unique([userId, challengeId])` — one progress record per user per challenge
- `@@index([userId])` — fast lookups for user progress
- `@@index([userId, status])` — efficient filtering for completed count on dashboard

### RateLimit

Fixed-window atomic rate limiting table ensuring multi-replica stateless safety.

- `key`: String (`@id`) — rate limit identifier (e.g. `rate:login:ip:<ip>`, `rate:reg:<ip>`, `rate:progress:user:<userId>`)
- `count`: Int (`@default(1)`) — number of hits in current window
- `windowStart`: DateTime (`@default(now())`) — start timestamp of current active window
- `@@index([windowStart])` — fast opportunistic garbage collection of expired windows
