import "server-only";
import { db } from "./db";
import { logger } from "./logger";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  current: number;
  limit: number;
}

const IP_V4_REGEX =
  /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/;
const IP_V6_REGEX =
  /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$|^::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}:$/;

/**
 * Extracts and validates the client IP from request headers.
 * In Phase 5, Nginx must configure:
 *   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 *   proxy_set_header X-Real-IP $remote_addr;
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && (IP_V4_REGEX.test(firstIp) || IP_V6_REGEX.test(firstIp))) {
      return firstIp;
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp && (IP_V4_REGEX.test(realIp) || IP_V6_REGEX.test(realIp))) {
    return realIp;
  }

  return "127.0.0.1";
}

/**
 * DB-backed fixed-window rate limiter.
 * Executes an atomic UPSERT in PostgreSQL to prevent read-then-write race conditions across replicas.
 */
export async function rateLimit({
  key,
  limit,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  // Opportunistic cleanup: 1 in 50 calls triggers cleanup of entries older than 2 hours
  if (Math.random() < 0.02) {
    cleanupExpiredRateLimits(7200).catch(() => {});
  }

  try {
    const now = new Date();
    const rows = await db.$queryRaw<
      Array<{ count: number; windowStart: Date }>
    >`
      INSERT INTO "rate_limits" ("key", "count", "windowStart")
      VALUES (${key}, 1, ${now})
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "rate_limits"."windowStart" + (${windowSeconds} * INTERVAL '1 second') < ${now} THEN 1
          ELSE "rate_limits"."count" + 1
        END,
        "windowStart" = CASE
          WHEN "rate_limits"."windowStart" + (${windowSeconds} * INTERVAL '1 second') < ${now} THEN ${now}
          ELSE "rate_limits"."windowStart"
        END
      RETURNING "count", "windowStart";
    `;

    const record = rows[0];
    const count = record ? Number(record.count) : 1;
    const windowStart = record ? new Date(record.windowStart) : now;

    const allowed = count <= limit;
    const remaining = Math.max(0, limit - count);
    const windowEndMs = windowStart.getTime() + windowSeconds * 1000;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowEndMs - Date.now()) / 1000)
    );

    return {
      allowed,
      remaining,
      retryAfterSeconds,
      current: count,
      limit,
    };
  } catch (error) {
    logger.error("Rate limit query failed, falling back to allow", {
      key,
      error: String(error),
    });
    // Fail-open on DB error so learners are not blocked if DB transiently fails
    return {
      allowed: true,
      remaining: 1,
      retryAfterSeconds: windowSeconds,
      current: 1,
      limit,
    };
  }
}

/**
 * Opportunistically deletes expired rate limit entries older than `olderThanSeconds`.
 */
export async function cleanupExpiredRateLimits(
  olderThanSeconds = 3600
): Promise<number> {
  try {
    const cutoff = new Date(Date.now() - olderThanSeconds * 1000);
    const res = await db.rateLimit.deleteMany({
      where: {
        windowStart: {
          lt: cutoff,
        },
      },
    });
    return res.count;
  } catch (err) {
    logger.warn("Opportunistic rate limit cleanup failed", {
      error: String(err),
    });
    return 0;
  }
}
