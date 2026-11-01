import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLessonById, getAllLessons } from "@/lib/lessons";
import { getChallengeById } from "@/lib/challenges";
import { checkSubmission } from "@/lib/checker";
import { MAX_CODE_LENGTH } from "@/lib/preview";
import { rateLimit } from "@/lib/rate-limit";
import { getProgressLimitConfig } from "@/lib/rate-limit-config";
import { logger } from "@/lib/logger";

const progressSchema = z.object({
  lessonId: z.string().min(1, "lessonId is required."),
  challengeId: z.string().min(1, "challengeId is required."),
  status: z.enum(["STARTED", "COMPLETED"]),
  submission: z
    .object({
      html: z.string(),
      css: z.string(),
    })
    .optional(),
});

export async function GET() {
  const { user, errorResponse } = await requireUser();
  if (errorResponse) return errorResponse;

  try {
    const [progressList, allLessons] = await Promise.all([
      db.progress.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "asc" },
      }),
      Promise.resolve(getAllLessons()),
    ]);

    const completed = progressList.filter(
      (p) => p.status === "COMPLETED"
    ).length;
    const total = allLessons.length;

    return NextResponse.json({
      progress: progressList,
      summary: {
        completed,
        total,
      },
    });
  } catch (error) {
    const errStr = String(error);
    const isDbUnavailable =
      errStr.includes("Can't reach database") ||
      errStr.includes("Connection") ||
      errStr.includes("PrismaClientInitializationError") ||
      errStr.includes("ECONNREFUSED");

    logger.error("Failed to fetch user progress", {
      userId: user.id,
      error: errStr,
    });
    return NextResponse.json(
      {
        error: {
          code: isDbUnavailable ? "SERVICE_UNAVAILABLE" : "INTERNAL_ERROR",
          message: isDbUnavailable
            ? "Database service is temporarily unavailable. Please retry in a moment."
            : "Failed to retrieve progress records.",
        },
      },
      {
        status: isDbUnavailable ? 503 : 500,
        headers: isDbUnavailable ? { "Retry-After": "5" } : undefined,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const { user, errorResponse } = await requireUser();
  if (errorResponse) return errorResponse;

  // 1. Content-Type check
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
  const progRule = getProgressLimitConfig();
  const limitRes = await rateLimit({
    key: `rate:progress:user:${user.id}`,
    limit: progRule.limit,
    windowSeconds: progRule.windowSeconds,
  });

  if (!limitRes.allowed) {
    logger.warn("Progress write rate limit exceeded", { userId: user.id });
    return NextResponse.json(
      {
        error: {
          code: "RATE_LIMITED",
          message: "Too many progress updates. Please slow down.",
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

  // 3. Body parsing
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

  const parsed = progressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: parsed.error.issues[0]?.message || "Invalid payload.",
        },
      },
      { status: 400 }
    );
  }

  const { lessonId, challengeId, status, submission } = parsed.data;

  // 4. Validate that lessonId and challengeId exist and cross-match
  const lesson = getLessonById(lessonId);
  const challenge = getChallengeById(challengeId);

  if (
    !lesson ||
    !challenge ||
    lesson.challengeId !== challengeId ||
    challenge.lessonId !== lessonId
  ) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_CHALLENGE",
          message: "Lesson and challenge reference mismatch or not found.",
        },
      },
      { status: 400 }
    );
  }

  // 5. Verification on COMPLETED
  if (status === "COMPLETED") {
    if (!submission) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_SUBMISSION",
            message: "Submission is required when completing a challenge.",
          },
        },
        { status: 400 }
      );
    }

    if (
      submission.html.length > MAX_CODE_LENGTH ||
      submission.css.length > MAX_CODE_LENGTH
    ) {
      return NextResponse.json(
        {
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: `Submission exceeds maximum allowed length of ${MAX_CODE_LENGTH.toLocaleString()} characters.`,
          },
        },
        { status: 413 }
      );
    }

    // Re-run static checker on server
    const checkResult = checkSubmission(submission, challenge);
    if (!checkResult.passed) {
      logger.info("Submission failed server-side check", {
        userId: user.id,
        challengeId,
        score: checkResult.score,
      });

      return NextResponse.json(
        {
          error: {
            code: "VERIFICATION_FAILED",
            message: "Submission does not pass all challenge requirements.",
          },
          results: checkResult.results,
          score: checkResult.score,
        },
        { status: 422 }
      );
    }
  }

  // 6. Upsert progress with downgrade prevention
  try {
    const existing = await db.progress.findUnique({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId,
        },
      },
    });

    // COMPLETED status must NEVER downgrade to STARTED
    if (existing?.status === "COMPLETED" && status === "STARTED") {
      return NextResponse.json({ progress: existing }, { status: 200 });
    }

    const updated = await db.progress.upsert({
      where: {
        userId_challengeId: {
          userId: user.id,
          challengeId,
        },
      },
      create: {
        userId: user.id,
        lessonId,
        challengeId,
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
      update: {
        status,
        completedAt:
          status === "COMPLETED" ? new Date() : existing?.completedAt,
      },
    });

    logger.info("Progress updated successfully", {
      userId: user.id,
      challengeId,
      status: updated.status,
    });

    return NextResponse.json({ progress: updated }, { status: 200 });
  } catch (error) {
    const errStr = String(error);
    const isDbUnavailable =
      errStr.includes("Can't reach database") ||
      errStr.includes("Connection") ||
      errStr.includes("PrismaClientInitializationError") ||
      errStr.includes("ECONNREFUSED");

    logger.error("Failed to upsert progress", {
      userId: user.id,
      challengeId,
      error: errStr,
    });
    return NextResponse.json(
      {
        error: {
          code: isDbUnavailable ? "SERVICE_UNAVAILABLE" : "INTERNAL_ERROR",
          message: isDbUnavailable
            ? "Database service is temporarily unavailable. Please retry in a moment."
            : "Failed to persist progress record.",
        },
      },
      {
        status: isDbUnavailable ? 503 : 500,
        headers: isDbUnavailable ? { "Retry-After": "5" } : undefined,
      }
    );
  }
}
