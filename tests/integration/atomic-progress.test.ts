/**
 * Integration test: atomic progress downgrade prevention.
 *
 * Tests the database-level upsert logic by invoking the Prisma operations
 * directly — same logic as in progress/route.ts POST handler.
 *
 * Runs in isolation (singleFork) so it doesn't race with phase4.test.ts's
 * "delete ALL users" beforeEach.
 *
 * Requires TEST_DATABASE_URL to point to a running Postgres instance.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// A challenge that exists in static content.
const LESSON_ID = "html-structure";
const CHALLENGE_ID = "challenge-html-structure";

// Use a unique stable email so we can always re-find/recreate this user.
const TEST_EMAIL = "atomic-downgrade-test@example.internal";

let userId = "";

async function ensureUser() {
  let user = await db.user.findUnique({ where: { email: TEST_EMAIL } });
  if (!user) {
    const hash = await hashPassword("AtomicTest123");
    user = await db.user.create({
      data: { email: TEST_EMAIL, passwordHash: hash, name: "Atomic Test" },
    });
  }
  userId = user.id;
}

/**
 * Mirrors the atomic logic from progress/route.ts POST handler.
 * STARTED: create-or-ignore (never overwrites COMPLETED).
 * COMPLETED: upsert unconditionally.
 */
async function writeProgress(
  uid: string,
  status: "STARTED" | "COMPLETED"
): Promise<{ status: string } | null> {
  if (status === "STARTED") {
    try {
      return await db.progress.create({
        data: {
          userId: uid,
          lessonId: LESSON_ID,
          challengeId: CHALLENGE_ID,
          status: "STARTED",
          completedAt: null,
        },
      });
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "P2002") {
        // Already exists (may be COMPLETED) — return current value.
        return db.progress.findUnique({
          where: { userId_challengeId: { userId: uid, challengeId: CHALLENGE_ID } },
        });
      }
      // P2003 = FK violation (user deleted by concurrent test) — treat as no-op.
      if (e?.code === "P2003") return null;
      throw err;
    }
  } else {
    try {
      return await db.progress.upsert({
        where: { userId_challengeId: { userId: uid, challengeId: CHALLENGE_ID } },
        create: {
          userId: uid,
          lessonId: LESSON_ID,
          challengeId: CHALLENGE_ID,
          status: "COMPLETED",
          completedAt: new Date(),
        },
        update: { status: "COMPLETED", completedAt: new Date() },
      });
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "P2003") return null; // user deleted mid-test
      throw err;
    }
  }
}

describe("Atomic progress downgrade prevention (integration)", () => {
  beforeAll(async () => {
    await ensureUser();
  });

  afterAll(async () => {
    await db.progress
      .deleteMany({ where: { userId } })
      .catch(() => {});
    await db.user
      .deleteMany({ where: { email: TEST_EMAIL } })
      .catch(() => {});
    await db.$disconnect();
  });

  it("final status is COMPLETED when STARTED and COMPLETED race concurrently (20 rounds)", async () => {
    for (let round = 0; round < 20; round++) {
      // Re-create user if deleted by a concurrent test file.
      await ensureUser();

      // Wipe this round's progress record.
      await db.progress.deleteMany({
        where: { userId, challengeId: CHALLENGE_ID },
      });

      // Fire STARTED and COMPLETED at exactly the same time.
      await Promise.all([
        writeProgress(userId, "STARTED"),
        writeProgress(userId, "COMPLETED"),
      ]);

      // Re-ensure user exists before querying (paranoia).
      await ensureUser();

      const final = await db.progress.findUnique({
        where: { userId_challengeId: { userId, challengeId: CHALLENGE_ID } },
      });

      expect(
        final?.status,
        `round ${round + 1}: status must be COMPLETED`
      ).toBe("COMPLETED");
    }
  });

  it("COMPLETED status is never downgraded to STARTED by subsequent STARTED requests", async () => {
    await ensureUser();
    await db.progress.deleteMany({ where: { userId, challengeId: CHALLENGE_ID } });

    // Write COMPLETED first.
    await writeProgress(userId, "COMPLETED");

    let row = await db.progress.findUnique({
      where: { userId_challengeId: { userId, challengeId: CHALLENGE_ID } },
    });
    expect(row?.status).toBe("COMPLETED");

    // Re-ensure user before the concurrent writes.
    await ensureUser();

    // Fire 5 concurrent STARTED requests.
    await Promise.all(
      Array.from({ length: 5 }, () => writeProgress(userId, "STARTED"))
    );

    row = await db.progress.findUnique({
      where: { userId_challengeId: { userId, challengeId: CHALLENGE_ID } },
    });
    expect(row?.status).toBe("COMPLETED");
  });
});
