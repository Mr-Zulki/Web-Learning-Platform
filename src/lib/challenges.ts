import "server-only";
import fs from "node:fs";
import path from "node:path";
import { challengeSchema, type Challenge } from "@/lib/challenge-schema";
import { getAllLessons } from "@/lib/lessons";

const DEFAULT_CHALLENGES_DIR = path.join(
  process.cwd(),
  "src/content/challenges"
);

export function getAllChallenges(
  challengesDir: string = DEFAULT_CHALLENGES_DIR,
  skipCrossValidation = false
): Challenge[] {
  if (!fs.existsSync(/*turbopackIgnore: true*/ challengesDir)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(/*turbopackIgnore: true*/ challengesDir)
    .filter((file) => file.endsWith(".json"));
  const challenges: Challenge[] = [];
  const seenIds = new Set<string>();

  for (const fileName of fileNames) {
    const filePath = path.join(
      /*turbopackIgnore: true*/ challengesDir,
      fileName
    );
    let parsedJson: unknown;
    try {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      parsedJson = JSON.parse(raw);
    } catch (err) {
      throw new Error(
        `Failed to parse JSON file "${fileName}": ${(err as Error).message}`
      );
    }

    const result = challengeSchema.safeParse(parsedJson);
    if (!result.success) {
      const failingFields = result.error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; ");
      throw new Error(
        `Invalid challenge content in "${fileName}": failing field(s) -> ${failingFields}`
      );
    }

    const challenge = result.data;

    if (seenIds.has(challenge.id)) {
      throw new Error(
        `Duplicate challenge id "${challenge.id}" found in "${fileName}".`
      );
    }
    seenIds.add(challenge.id);

    challenges.push(challenge);
  }

  if (!skipCrossValidation) {
    // Cross-validate with lessons
    const lessons = getAllLessons();
    const challengeMap = new Map(challenges.map((c) => [c.id, c]));
    const lessonMap = new Map(lessons.map((l) => [l.id, l]));

    // 1. Every lesson's challengeId must resolve to a challenge
    for (const lesson of lessons) {
      if (!challengeMap.has(lesson.challengeId)) {
        throw new Error(
          `Cross-validation error: Lesson "${lesson.id}" references challenge "${lesson.challengeId}", but no matching challenge was found.`
        );
      }
    }

    // 2. Every challenge's lessonId must resolve to a lesson
    for (const challenge of challenges) {
      if (!lessonMap.has(challenge.lessonId)) {
        throw new Error(
          `Cross-validation error: Challenge "${challenge.id}" references lesson "${challenge.lessonId}", but no matching lesson was found.`
        );
      }
    }
  }

  return challenges;
}

export function getChallengeById(
  id: string,
  challengesDir?: string
): Challenge | null {
  const challenges = getAllChallenges(challengesDir);
  return challenges.find((challenge) => challenge.id === id) ?? null;
}

export function getChallengeForLesson(
  lessonId: string,
  challengesDir?: string
): Challenge | null {
  const challenges = getAllChallenges(challengesDir);
  return (
    challenges.find((challenge) => challenge.lessonId === lessonId) ?? null
  );
}

export interface ClientChallenge {
  id: string;
  lessonId: string;
  title: string;
  task: string;
  hints: string[];
  rules: Challenge["rules"];
}

export function toClientChallenge(challenge: Challenge): ClientChallenge {
  return {
    id: challenge.id,
    lessonId: challenge.lessonId,
    title: challenge.title,
    task: challenge.task,
    hints: [...challenge.hints],
    rules: challenge.rules,
  };
}
