import { describe, it, expect } from "vitest";
import { lessonSchema } from "@/lib/lesson-schema";

describe("lessonSchema", () => {
  const validLesson = {
    id: "html-structure",
    title: "HTML Structure",
    order: 1,
    summary: "Basic document skeleton.",
    body: "# Content\n\nSome text.",
    starterCode: {
      html: "<!DOCTYPE html>",
      css: "body { margin: 0; }",
    },
    challengeId: "challenge-html-structure",
  };

  it("successfully validates a complete, valid lesson", () => {
    const result = lessonSchema.safeParse(validLesson);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("html-structure");
      expect(result.data.order).toBe(1);
    }
  });

  it("fails when id is missing or not kebab-case", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, id: undefined }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({ ...validLesson, id: "Invalid_ID" }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({ ...validLesson, id: "has space" }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({ ...validLesson, id: "UPPERCASE" }).success
    ).toBe(false);
  });

  it("fails when title is missing or empty", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, title: undefined }).success
    ).toBe(false);
    expect(lessonSchema.safeParse({ ...validLesson, title: "" }).success).toBe(
      false
    );
  });

  it("fails when order is missing, non-positive, or not an integer", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, order: undefined }).success
    ).toBe(false);
    expect(lessonSchema.safeParse({ ...validLesson, order: 0 }).success).toBe(
      false
    );
    expect(lessonSchema.safeParse({ ...validLesson, order: -1 }).success).toBe(
      false
    );
    expect(lessonSchema.safeParse({ ...validLesson, order: 1.5 }).success).toBe(
      false
    );
  });

  it("fails when summary is missing or empty", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, summary: undefined }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({ ...validLesson, summary: "" }).success
    ).toBe(false);
  });

  it("fails when body is missing or empty", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, body: undefined }).success
    ).toBe(false);
    expect(lessonSchema.safeParse({ ...validLesson, body: "" }).success).toBe(
      false
    );
  });

  it("fails when starterCode is missing or incomplete", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, starterCode: undefined }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({
        ...validLesson,
        starterCode: { html: "<p>Hi</p>" },
      }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({
        ...validLesson,
        starterCode: { css: "body {}" },
      }).success
    ).toBe(false);
  });

  it("fails when challengeId is missing or empty", () => {
    expect(
      lessonSchema.safeParse({ ...validLesson, challengeId: undefined }).success
    ).toBe(false);
    expect(
      lessonSchema.safeParse({ ...validLesson, challengeId: "" }).success
    ).toBe(false);
  });
});
