import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  getAllLessons,
  getLessonById,
  getAdjacentLessons,
} from "@/lib/lessons";
import { lessonSchema } from "@/lib/lesson-schema";

describe("lessons loader", () => {
  const contentDir = path.join(process.cwd(), "src/content/lessons");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 5 sorted lessons from the content directory", () => {
    const lessons = getAllLessons();
    expect(lessons).toHaveLength(5);

    // Verify ordering
    for (let i = 0; i < lessons.length - 1; i++) {
      const current = lessons[i]!;
      const next = lessons[i + 1]!;
      expect(current.order).toBeLessThan(next.order);
    }

    expect(lessons[0]?.id).toBe("html-structure");
    expect(lessons[1]?.id).toBe("text-tags");
    expect(lessons[2]?.id).toBe("links-and-images");
    expect(lessons[3]?.id).toBe("css-selectors");
    expect(lessons[4]?.id).toBe("box-model");
  });

  it("finds existing lesson by id and returns null for unknown id", () => {
    const lesson = getLessonById("html-structure");
    expect(lesson).not.toBeNull();
    expect(lesson?.title).toBe("HTML Structure & Document Skeleton");

    const nonExistent = getLessonById("non-existent-lesson");
    expect(nonExistent).toBeNull();
  });

  it("calculates adjacent lessons correctly for first, middle, and last", () => {
    // First lesson
    const firstAdj = getAdjacentLessons("html-structure");
    expect(firstAdj.prev).toBeNull();
    expect(firstAdj.next).not.toBeNull();
    expect(firstAdj.next?.id).toBe("text-tags");

    // Middle lesson
    const midAdj = getAdjacentLessons("links-and-images");
    expect(midAdj.prev).not.toBeNull();
    expect(midAdj.prev?.id).toBe("text-tags");
    expect(midAdj.next).not.toBeNull();
    expect(midAdj.next?.id).toBe("css-selectors");

    // Last lesson
    const lastAdj = getAdjacentLessons("box-model");
    expect(lastAdj.prev).not.toBeNull();
    expect(lastAdj.prev?.id).toBe("css-selectors");
    expect(lastAdj.next).toBeNull();

    // Unknown lesson
    const unknownAdj = getAdjacentLessons("unknown");
    expect(unknownAdj.prev).toBeNull();
    expect(unknownAdj.next).toBeNull();
  });

  it("validates that all real lesson JSON files match the Zod schema", () => {
    const fileNames = fs
      .readdirSync(contentDir)
      .filter((file) => file.endsWith(".json"));

    expect(fileNames.length).toBe(5);

    for (const fileName of fileNames) {
      const filePath = path.join(contentDir, fileName);
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      const result = lessonSchema.safeParse(parsed);
      expect(
        result.success,
        `File ${fileName} failed validation: ${result.error?.message}`
      ).toBe(true);
    }
  });

  it("ensures all real lesson ids and orders are unique", () => {
    const lessons = getAllLessons();
    const ids = lessons.map((l) => l.id);
    const orders = lessons.map((l) => l.order);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("returns empty array if directory does not exist", () => {
    const nonExistentDir = path.join(process.cwd(), "non-existent-folder-xyz");
    expect(getAllLessons(nonExistentDir)).toEqual([]);
  });

  it("throws clear error when JSON is malformed", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "bad.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);
    vi.spyOn(fs, "readFileSync").mockReturnValue("invalid {json");

    expect(() => getAllLessons()).toThrowError(
      /Failed to parse JSON file "bad.json"/
    );
  });

  it("throws clear error naming the file and failing field when schema validation fails", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "invalid.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);
    vi.spyOn(fs, "readFileSync").mockReturnValue(
      JSON.stringify({
        id: "bad id with space",
        title: "Test",
        order: 1,
        summary: "test",
        body: "test",
        starterCode: { html: "", css: "" },
        challengeId: "challenge-test",
      })
    );

    expect(() => getAllLessons()).toThrowError(
      /Invalid lesson content in "invalid.json": failing field\(s\) -> id:/
    );
  });

  it("throws error when duplicate lesson ids are detected", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "a.json",
      "b.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.spyOn(fs, "readFileSync")
      .mockReturnValueOnce(
        JSON.stringify({
          id: "duplicate-id",
          title: "A",
          order: 1,
          summary: "test",
          body: "test",
          starterCode: { html: "", css: "" },
          challengeId: "challenge-a",
        })
      )
      .mockReturnValueOnce(
        JSON.stringify({
          id: "duplicate-id",
          title: "B",
          order: 2,
          summary: "test",
          body: "test",
          starterCode: { html: "", css: "" },
          challengeId: "challenge-b",
        })
      );

    expect(() => getAllLessons()).toThrowError(
      /Duplicate lesson id "duplicate-id" found in "b.json"./
    );
  });

  it("throws error when duplicate lesson orders are detected", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "a.json",
      "b.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    vi.spyOn(fs, "readFileSync")
      .mockReturnValueOnce(
        JSON.stringify({
          id: "lesson-a",
          title: "A",
          order: 1,
          summary: "test",
          body: "test",
          starterCode: { html: "", css: "" },
          challengeId: "challenge-a",
        })
      )
      .mockReturnValueOnce(
        JSON.stringify({
          id: "lesson-b",
          title: "B",
          order: 1,
          summary: "test",
          body: "test",
          starterCode: { html: "", css: "" },
          challengeId: "challenge-b",
        })
      );

    expect(() => getAllLessons()).toThrowError(
      /Duplicate lesson order "1" found in "b.json"./
    );
  });
});
