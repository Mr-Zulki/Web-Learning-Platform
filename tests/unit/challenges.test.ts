import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  getAllChallenges,
  getChallengeById,
  getChallengeForLesson,
  toClientChallenge,
} from "@/lib/challenges";
import * as lessonsModule from "@/lib/lessons";
import type { Lesson } from "@/lib/lesson-schema";

describe("challenges loader", () => {
  const challengesDir = path.join(process.cwd(), "src/content/challenges");

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads 5 valid challenges from the content directory", () => {
    const challenges = getAllChallenges();
    expect(challenges).toHaveLength(5);

    const ids = challenges.map((c) => c.id);
    expect(ids).toContain("challenge-html-structure");
    expect(ids).toContain("challenge-text-tags");
    expect(ids).toContain("challenge-links-and-images");
    expect(ids).toContain("challenge-css-selectors");
    expect(ids).toContain("challenge-box-model");
  });

  it("finds challenge by id and by lessonId", () => {
    const byId = getChallengeById("challenge-html-structure");
    expect(byId).not.toBeNull();
    expect(byId?.lessonId).toBe("html-structure");

    const byLesson = getChallengeForLesson("text-tags");
    expect(byLesson).not.toBeNull();
    expect(byLesson?.id).toBe("challenge-text-tags");

    expect(getChallengeById("non-existent")).toBeNull();
    expect(getChallengeForLesson("non-existent")).toBeNull();
  });

  it("cross-validates successfully against the real lessons", () => {
    expect(() => getAllChallenges()).not.toThrow();
  });

  it("throws loud error if a lesson references a missing challenge", () => {
    const mockLessons = [
      {
        id: "lesson-orphan",
        title: "Orphan",
        order: 99,
        summary: "test",
        body: "test",
        starterCode: { html: "", css: "" },
        challengeId: "challenge-missing-xyz",
      },
    ];

    vi.spyOn(lessonsModule, "getAllLessons").mockReturnValue(mockLessons);

    expect(() => getAllChallenges()).toThrowError(
      /Cross-validation error: Lesson "lesson-orphan" references challenge "challenge-missing-xyz"/
    );
  });

  it("throws loud error if a challenge references a missing lesson", () => {
    const mockLessons: Lesson[] = [];
    vi.spyOn(lessonsModule, "getAllLessons").mockReturnValue(mockLessons);

    expect(() => getAllChallenges()).toThrowError(
      /Cross-validation error: Challenge "challenge-[^"]+" references lesson/
    );
  });

  it("does not leak known-good solutions through the client props helper", () => {
    const challenge = getChallengeById("challenge-html-structure");
    expect(challenge).not.toBeNull();

    const clientData = toClientChallenge(challenge!);
    expect(clientData).toHaveProperty("id");
    expect(clientData).toHaveProperty("lessonId");
    expect(clientData).toHaveProperty("title");
    expect(clientData).toHaveProperty("task");
    expect(clientData).toHaveProperty("hints");
    expect(clientData).toHaveProperty("rules");

    // Solutions must never exist on the client challenge payload
    expect(clientData).not.toHaveProperty("solution");
    expect(clientData).not.toHaveProperty("answer");
    expect(clientData).not.toHaveProperty("starterCode");
  });

  it("throws clear error on malformed JSON", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "bad.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);
    vi.spyOn(fs, "readFileSync").mockReturnValue("{ malformed json");

    expect(() => getAllChallenges(challengesDir, true)).toThrowError(
      /Failed to parse JSON file "bad.json"/
    );
  });

  it("throws clear error on duplicate challenge ids", () => {
    vi.spyOn(fs, "readdirSync").mockReturnValue([
      "a.json",
      "b.json",
    ] as unknown as ReturnType<typeof fs.readdirSync>);

    const challengePayload = JSON.stringify({
      id: "challenge-duplicate",
      lessonId: "test",
      title: "Dupe",
      task: "Dupe task",
      hints: ["hint 1"],
      rules: [
        { type: "element-exists", selector: "h1", message: "m1" },
        { type: "element-exists", selector: "p", message: "m2" },
      ],
    });

    vi.spyOn(fs, "readFileSync").mockReturnValue(challengePayload);

    expect(() => getAllChallenges(challengesDir, true)).toThrowError(
      /Duplicate challenge id "challenge-duplicate" found in "b.json"./
    );
  });
});
