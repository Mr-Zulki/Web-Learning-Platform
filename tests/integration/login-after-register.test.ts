import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { POST as registerHandler } from "@/app/api/auth/register/route";
import { loginSchema } from "@/lib/auth-schema";
import {
  hashPassword,
  verifyPassword,
  isScryptHash,
} from "@/lib/password";

// Unique email to avoid collisions with phase4.test.ts (which deletes ALL users)
const TEST_EMAIL_RAW = "LoginBug.Regression@Example.com";
const TEST_EMAIL_NORMALIZED = "loginbug.regression@example.com";
const TEST_PASSWORD = "Test12345";
const TEST_NAME = "Login Bug Regression";

/**
 * Helper: ensure the test user exists in the database.
 * Re-creates it if missing (e.g. deleted by a concurrent test file).
 */
async function ensureTestUser() {
  let user = await db.user.findUnique({
    where: { email: TEST_EMAIL_NORMALIZED },
  });
  if (!user) {
    const hash = await hashPassword(TEST_PASSWORD);
    user = await db.user.create({
      data: { email: TEST_EMAIL_NORMALIZED, passwordHash: hash, name: TEST_NAME },
    });
  }
  return user;
}

describe("Login after register (regression)", () => {
  beforeEach(async () => {
    // Ensure the test user exists before every test, protecting against
    // concurrent test files that may delete all users.
    await ensureTestUser();
  });

  afterAll(async () => {
    await db.user
      .deleteMany({ where: { email: TEST_EMAIL_NORMALIZED } })
      .catch(() => {});
    await db.$disconnect();
  });

  it("register stores normalized email and scrypt hash", async () => {
    // Delete first so register creates fresh
    await db.user.deleteMany({ where: { email: TEST_EMAIL_NORMALIZED } });

    const req = new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: TEST_NAME,
        email: TEST_EMAIL_RAW,
        password: TEST_PASSWORD,
      }),
    });

    const res = await registerHandler(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.user.email).toBe(TEST_EMAIL_NORMALIZED);

    // Verify the stored hash format
    const dbUser = await db.user.findUnique({
      where: { email: TEST_EMAIL_NORMALIZED },
    });
    expect(dbUser).not.toBeNull();
    expect(isScryptHash(dbUser!.passwordHash)).toBe(true);
  });

  it("login with same password succeeds immediately after register", async () => {
    // Simulate what authorize() does: parse credentials, look up user, verify password
    const parsed = loginSchema.safeParse({
      email: TEST_EMAIL_RAW,
      password: TEST_PASSWORD,
    });
    expect(parsed.success).toBe(true);

    const { email, password } = parsed.data!;
    expect(email).toBe(TEST_EMAIL_NORMALIZED);

    const user = await db.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();

    const { valid } = await verifyPassword(password, user!.passwordHash);
    expect(valid).toBe(true);
  });

  it("login with different case email succeeds", async () => {
    // Ensure the user exists right here — concurrent test files may have deleted
    // all users between our beforeEach and this test body.
    await ensureTestUser();

    const parsed = loginSchema.safeParse({
      email: "LOGINBUG.REGRESSION@EXAMPLE.COM",
      password: TEST_PASSWORD,
    });
    expect(parsed.success).toBe(true);

    const { email, password } = parsed.data!;
    expect(email).toBe(TEST_EMAIL_NORMALIZED);

    const user = await db.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();

    const { valid } = await verifyPassword(password, user!.passwordHash);
    expect(valid).toBe(true);
  });

  it("login with wrong password returns invalid", async () => {
    const user = await ensureTestUser();
    const { valid } = await verifyPassword("WrongPassword99", user.passwordHash);
    expect(valid).toBe(false);
  });

  it("login with unknown email returns no user", async () => {
    const user = await db.user.findUnique({
      where: { email: "nonexistent-loginbug@example.com" },
    });
    expect(user).toBeNull();
  });

  it("hashPassword output is verified by verifyPassword (round-trip)", async () => {
    const hash = await hashPassword(TEST_PASSWORD);
    expect(isScryptHash(hash)).toBe(true);

    const { valid } = await verifyPassword(TEST_PASSWORD, hash);
    expect(valid).toBe(true);

    const { valid: wrongValid } = await verifyPassword("WrongPass", hash);
    expect(wrongValid).toBe(false);
  });
});
