import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit, cleanupExpiredRateLimits } from "@/lib/rate-limit";
import { db } from "@/lib/db";

describe("rate-limit logic with mock DB", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns allowed: true when count is within limit", async () => {
    const now = new Date();
    vi.spyOn(db, "$queryRaw").mockResolvedValueOnce([
      { count: 1, windowStart: now },
    ] as unknown as Array<{ count: number; windowStart: Date }>);

    const result = await rateLimit({
      key: "rate:test:key",
      limit: 5,
      windowSeconds: 60,
    });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.current).toBe(1);
    expect(result.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  it("returns allowed: false when count exceeds limit", async () => {
    const now = new Date();
    vi.spyOn(db, "$queryRaw").mockResolvedValueOnce([
      { count: 6, windowStart: now },
    ] as unknown as Array<{ count: number; windowStart: Date }>);

    const result = await rateLimit({
      key: "rate:test:key",
      limit: 5,
      windowSeconds: 60,
    });

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.current).toBe(6);
  });

  it("fails open on database error to avoid blocking learners", async () => {
    vi.spyOn(db, "$queryRaw").mockRejectedValueOnce(
      new Error("Database disconnected")
    );

    const result = await rateLimit({
      key: "rate:test:error",
      limit: 5,
      windowSeconds: 60,
    });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it("cleans up expired rate limit entries", async () => {
    vi.spyOn(db.rateLimit, "deleteMany").mockResolvedValueOnce({ count: 12 });

    const deletedCount = await cleanupExpiredRateLimits(3600);
    expect(deletedCount).toBe(12);
  });

  it("handles cleanup errors gracefully without throwing", async () => {
    vi.spyOn(db.rateLimit, "deleteMany").mockRejectedValueOnce(
      new Error("DB error")
    );

    const deletedCount = await cleanupExpiredRateLimits(3600);
    expect(deletedCount).toBe(0);
  });
});
