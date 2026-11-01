import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/auth-schema";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getRegisterLimitConfig } from "@/lib/rate-limit-config";
import { logger } from "@/lib/logger";
import { hashPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  // 1. Content-Type security check
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json(
      {
        error: {
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Request Content-Type must be application/json.",
        },
      },
      { status: 415 }
    );
  }

  // 2. Rate limiting based on active profile
  const ip = getClientIp(req.headers);
  const regRule = getRegisterLimitConfig();
  const limitRes = await rateLimit({
    key: `rate:register:ip:${ip}`,
    limit: regRule.limit,
    windowSeconds: regRule.windowSeconds,
  });

  if (!limitRes.allowed) {
    logger.warn("Registration rate limit exceeded", { ip });
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message:
            "Too many registration attempts from this address. Please try again later.",
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": limitRes.retryAfterSeconds.toString(),
        },
      }
    );
  }

  // 3. Body parsing & validation
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "Invalid JSON in request body.",
        },
      },
      { status: 400 }
    );
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: firstIssue?.message || "Invalid input data.",
        },
      },
      { status: 400 }
    );
  }

  const { email, password, name } = parsed.data;

  // 4. Check for existing user (case-insensitive due to lowercase normalization)
  try {
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      logger.info("Registration attempted with existing email", { email });
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_TAKEN",
            message:
              "An account with this email already exists. Please log in instead.",
          },
        },
        { status: 409 }
      );
    }

    // 5. Hash password asynchronously with crypto.scrypt off the event loop
    const passwordHash = await hashPassword(password);

    // 6. Create user in database
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    logger.info("New user registered successfully", {
      userId: user.id,
      email: user.email,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };

    // Concurrent registration race condition: Prisma unique constraint failure (P2002)
    if (errObj?.code === "P2002") {
      logger.info("Concurrent registration collided on existing email", {
        email,
      });
      return NextResponse.json(
        {
          error: {
            code: "EMAIL_TAKEN",
            message:
              "An account with this email already exists. Please log in instead.",
          },
        },
        { status: 409 }
      );
    }

    const errStr = String(error);
    const isDbUnavailable =
      errStr.includes("Can't reach database") ||
      errStr.includes("Connection") ||
      errStr.includes("PrismaClientInitializationError") ||
      errStr.includes("ECONNREFUSED");

    logger.error("Failed to register user", { error: errStr });

    return NextResponse.json(
      {
        error: {
          code: isDbUnavailable ? "SERVICE_UNAVAILABLE" : "INTERNAL_ERROR",
          message: isDbUnavailable
            ? "Database service is temporarily unavailable. Please retry in a moment."
            : "An unexpected error occurred. Please try again later.",
        },
      },
      {
        status: isDbUnavailable ? 503 : 500,
        headers: isDbUnavailable ? { "Retry-After": "5" } : undefined,
      }
    );
  }
}
