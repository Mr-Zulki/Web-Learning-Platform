import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { GET as healthHandler } from "@/app/api/health/route";
import {
  GET as progressGetHandler,
  POST as progressPostHandler,
} from "@/app/api/progress/route";
import * as authModule from "@/lib/auth";
import { verifyPassword, isScryptHash, hashPassword } from "@/lib/password";

describe("Phase 4 Integration Tests (PostgreSQL uni_test)", () => {
  beforeEach(async () => {
    // Reset test database state between tests
    await db.progress.deleteMany();
    await db.user.deleteMany();
    await db.rateLimit.deleteMany();
    vi.restoreAllMocks();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  describe("1. Registration & Authentication Flow", () => {
    it("registers a new user with scrypt hash and no password leak", async () => {
      const req = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Learner",
          email: "learner@example.com",
          password: "password123",
        }),
      });

      const res = await registerHandler(req);
      expect(res.status).toBe(201);
      const data = await res.json();

      expect(data.user).toBeDefined();
      expect(data.user.email).toBe("learner@example.com");
      expect(data.user.name).toBe("Test Learner");
      expect(data.user.passwordHash).toBeUndefined();

      // Verify in PostgreSQL database
      const dbUser = await db.user.findUnique({
        where: { email: "learner@example.com" },
      });
      expect(dbUser).not.toBeNull();
      expect(isScryptHash(dbUser!.passwordHash)).toBe(true);
      expect(dbUser?.passwordHash).toMatch(/^scrypt\$16384\$8\$1\$/);
      const { valid } = await verifyPassword(
        "password123",
        dbUser!.passwordHash
      );
      expect(valid).toBe(true);
    });

    it("transparently upgrades legacy bcrypt password hash to scrypt on successful login", async () => {
      // Seed user with legacy bcrypt hash
      const legacyBcryptHash = await bcrypt.hash("myPassword123!", 10);
      const legacyUser = await db.user.create({
        data: {
          name: "Legacy User",
          email: "legacy@example.com",
          passwordHash: legacyBcryptHash,
        },
      });

      expect(legacyUser.passwordHash).toMatch(/^\$2[aby]\$/);

      // Verify and upgrade
      const verification = await verifyPassword(
        "myPassword123!",
        legacyUser.passwordHash
      );
      expect(verification.valid).toBe(true);
      expect(verification.needsUpgrade).toBe(true);

      const upgradedHash = await hashPassword("myPassword123!");
      await db.user.update({
        where: { id: legacyUser.id },
        data: { passwordHash: upgradedHash },
      });

      // Verify updated record in DB
      const updatedUser = await db.user.findUnique({
        where: { id: legacyUser.id },
      });
      expect(isScryptHash(updatedUser!.passwordHash)).toBe(true);
      const postUpgrade = await verifyPassword(
        "myPassword123!",
        updatedUser!.passwordHash
      );
      expect(postUpgrade.valid).toBe(true);
      expect(postUpgrade.needsUpgrade).toBe(false);
    });

    it("keeps /api/health fast and non-blocked while concurrent scrypt hashing runs", async () => {
      // Start 5 concurrent hashing operations
      const hashingPromises = Promise.all([
        hashPassword("Pass1!"),
        hashPassword("Pass2!"),
        hashPassword("Pass3!"),
        hashPassword("Pass4!"),
        hashPassword("Pass5!"),
      ]);

      // Measure healthcheck latency during active hashing
      const start = Date.now();
      const healthRes = await healthHandler();
      const elapsed = Date.now() - start;

      expect(healthRes.status).toBe(200);
      // Health check should resolve immediately without waiting for libuv threadpool scrypt tasks
      expect(elapsed).toBeLessThan(100);

      await hashingPromises;
    });

    it("rejects duplicate email with 409 Conflict", async () => {
      // First registration
      const req1 = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "First User",
          email: "duplicate@example.com",
          password: "password123",
        }),
      });
      await registerHandler(req1);

      // Duplicate registration attempt
      const req2 = new NextRequest("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Second User",
          email: "duplicate@example.com",
          password: "differentPassword123",
        }),
      });
      const res2 = await registerHandler(req2);
      expect(res2.status).toBe(409);
      const data2 = await res2.json();
      expect(data2.error.code).toBe("EMAIL_TAKEN");
    });
  });

  describe("2. Rate Limiting", () => {
    it("returns allowed: false and retryAfterSeconds when limit is exceeded", async () => {
      const key = "rate:test:limit-key";
      const limit = 3;
      const windowSeconds = 60;

      const r1 = await rateLimit({ key, limit, windowSeconds });
      const r2 = await rateLimit({ key, limit, windowSeconds });
      const r3 = await rateLimit({ key, limit, windowSeconds });
      const r4 = await rateLimit({ key, limit, windowSeconds });

      expect(r1.allowed).toBe(true);
      expect(r2.allowed).toBe(true);
      expect(r3.allowed).toBe(true);
      expect(r4.allowed).toBe(false);
      expect(r4.remaining).toBe(0);
      expect(r4.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  describe("3. Progress API & Server Re-Check", () => {
    it("returns 401 when unauthenticated", async () => {
      vi.spyOn(authModule, "requireUser").mockResolvedValue({
        user: null,
        errorResponse: NextResponse.json(
          { error: { code: "UNAUTHORIZED", message: "Auth required" } },
          { status: 401 }
        ),
      });

      const getRes = await progressGetHandler();
      expect(getRes.status).toBe(401);

      const postReq = new NextRequest("http://localhost:3000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "html-structure",
          challengeId: "challenge-html-structure",
          status: "STARTED",
        }),
      });
      const postRes = await progressPostHandler(postReq);
      expect(postRes.status).toBe(401);
    });

    it("saves STARTED status and returns progress summary on GET", async () => {
      const testUser = await db.user.create({
        data: {
          email: "student@example.com",
          passwordHash: "$2b$12$dummyhash",
          name: "Student",
        },
      });

      vi.spyOn(authModule, "requireUser").mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: testUser.name },
        errorResponse: null,
      });

      const postReq = new NextRequest("http://localhost:3000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "html-structure",
          challengeId: "challenge-html-structure",
          status: "STARTED",
        }),
      });

      const postRes = await progressPostHandler(postReq);
      expect(postRes.status).toBe(200);

      const getRes = await progressGetHandler();
      expect(getRes.status).toBe(200);
      const data = await getRes.json();

      expect(data.progress).toHaveLength(1);
      expect(data.progress[0].status).toBe("STARTED");
      expect(data.summary.completed).toBe(0);
      expect(data.summary.total).toBe(5);
    });

    it("rejects COMPLETED status when submission fails static checker", async () => {
      const testUser = await db.user.create({
        data: {
          email: "student2@example.com",
          passwordHash: "$2b$12$dummyhash",
          name: "Student 2",
        },
      });

      vi.spyOn(authModule, "requireUser").mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: testUser.name },
        errorResponse: null,
      });

      const postReq = new NextRequest("http://localhost:3000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "html-structure",
          challengeId: "challenge-html-structure",
          status: "COMPLETED",
          submission: {
            html: "<div>Incomplete markup</div>",
            css: "",
          },
        }),
      });

      const postRes = await progressPostHandler(postReq);
      expect(postRes.status).toBe(422);
      const data = await postRes.json();
      expect(data.error.code).toBe("VERIFICATION_FAILED");

      // Verify no record marked COMPLETED in database
      const count = await db.progress.count({
        where: { userId: testUser.id, status: "COMPLETED" },
      });
      expect(count).toBe(0);
    });

    it("accepts COMPLETED status when submission matches Phase 3 known-good solution", async () => {
      const testUser = await db.user.create({
        data: {
          email: "student3@example.com",
          passwordHash: "$2b$12$dummyhash",
          name: "Student 3",
        },
      });

      vi.spyOn(authModule, "requireUser").mockResolvedValue({
        user: { id: testUser.id, email: testUser.email, name: testUser.name },
        errorResponse: null,
      });

      const solutionPath = path.join(
        process.cwd(),
        "tests/fixtures/solutions/challenge-html-structure.json"
      );
      const solution = JSON.parse(fs.readFileSync(solutionPath, "utf-8"));

      const postReq = new NextRequest("http://localhost:3000/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "html-structure",
          challengeId: "challenge-html-structure",
          status: "COMPLETED",
          submission: solution,
        }),
      });

      const postRes = await progressPostHandler(postReq);
      expect(postRes.status).toBe(200);
      const postData = await postRes.json();
      expect(postData.progress.status).toBe("COMPLETED");
      expect(postData.progress.completedAt).not.toBeNull();

      // Subsequent STARTED attempt must not downgrade status
      const downgradeReq = new NextRequest(
        "http://localhost:3000/api/progress",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId: "html-structure",
            challengeId: "challenge-html-structure",
            status: "STARTED",
          }),
        }
      );
      const downgradeRes = await progressPostHandler(downgradeReq);
      expect(downgradeRes.status).toBe(200);
      const downgradeData = await downgradeRes.json();
      expect(downgradeData.progress.status).toBe("COMPLETED");
    });

    it("cascades delete of progress records when user is deleted", async () => {
      const user = await db.user.create({
        data: {
          email: "to-delete@example.com",
          passwordHash: "$2b$12$dummyhash",
          name: "Delete Me",
        },
      });

      await db.progress.create({
        data: {
          userId: user.id,
          lessonId: "html-structure",
          challengeId: "challenge-html-structure",
          status: "STARTED",
        },
      });

      const beforeCount = await db.progress.count({
        where: { userId: user.id },
      });
      expect(beforeCount).toBe(1);

      await db.user.delete({ where: { id: user.id } });

      const afterCount = await db.progress.count({
        where: { userId: user.id },
      });
      expect(afterCount).toBe(0);
    });
  });
});
