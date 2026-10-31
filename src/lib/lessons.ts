import "server-only";
import fs from "node:fs";
import path from "node:path";
import { lessonSchema, type Lesson } from "@/lib/lesson-schema";

const DEFAULT_LESSONS_DIR = path.join(process.cwd(), "src/content/lessons");

export function getAllLessons(dirPath: string = DEFAULT_LESSONS_DIR): Lesson[] {
  if (!fs.existsSync(/*turbopackIgnore: true*/ dirPath)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(/*turbopackIgnore: true*/ dirPath)
    .filter((file) => file.endsWith(".json"));
  const lessons: Lesson[] = [];
  const seenIds = new Set<string>();
  const seenOrders = new Set<number>();

  for (const fileName of fileNames) {
    const filePath = path.join(/*turbopackIgnore: true*/ dirPath, fileName);
    let parsedJson: unknown;
    try {
      const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
      parsedJson = JSON.parse(raw);
    } catch (err) {
      throw new Error(
        `Failed to parse JSON file "${fileName}": ${(err as Error).message}`
      );
    }

    const result = lessonSchema.safeParse(parsedJson);
    if (!result.success) {
      const failingFields = result.error.issues
        .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
        .join("; ");
      throw new Error(
        `Invalid lesson content in "${fileName}": failing field(s) -> ${failingFields}`
      );
    }

    const lesson = result.data;

    if (seenIds.has(lesson.id)) {
      throw new Error(
        `Duplicate lesson id "${lesson.id}" found in "${fileName}".`
      );
    }
    seenIds.add(lesson.id);

    if (seenOrders.has(lesson.order)) {
      throw new Error(
        `Duplicate lesson order "${lesson.order}" found in "${fileName}".`
      );
    }
    seenOrders.add(lesson.order);

    lessons.push(lesson);
  }

  return lessons.sort((a, b) => a.order - b.order);
}

export function getLessonById(id: string, dirPath?: string): Lesson | null {
  const lessons = getAllLessons(dirPath);
  return lessons.find((lesson) => lesson.id === id) ?? null;
}

export function getAdjacentLessons(
  id: string,
  dirPath?: string
): { prev: Lesson | null; next: Lesson | null } {
  const lessons = getAllLessons(dirPath);
  const currentIndex = lessons.findIndex((lesson) => lesson.id === id);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev = currentIndex > 0 ? (lessons[currentIndex - 1] ?? null) : null;
  const next =
    currentIndex < lessons.length - 1
      ? (lessons[currentIndex + 1] ?? null)
      : null;

  return { prev, next };
}
