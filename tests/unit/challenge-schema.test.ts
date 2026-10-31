import { describe, it, expect } from "vitest";
import { challengeSchema } from "@/lib/challenge-schema";

describe("challengeSchema", () => {
  const validChallenge = {
    id: "challenge-html-structure",
    lessonId: "html-structure",
    title: "Build Document Skeleton",
    task: "Create standard document tags.",
    hints: ["Start with <!DOCTYPE html>", "Add head and body"],
    rules: [
      {
        type: "element-exists",
        selector: "html",
        min: 1,
        message: "Must have html",
      },
      {
        type: "element-exists",
        selector: "body",
        min: 1,
        message: "Must have body",
      },
    ],
  };

  it("validates a complete, valid challenge", () => {
    const result = challengeSchema.safeParse(validChallenge);
    expect(result.success).toBe(true);
  });

  it("fails when id does not start with challenge- or is invalid", () => {
    expect(
      challengeSchema.safeParse({ ...validChallenge, id: "invalid-id" }).success
    ).toBe(false);
    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        id: "challenge_underscore",
      }).success
    ).toBe(false);
  });

  it("fails when unknown rule type is provided", () => {
    const invalid = {
      ...validChallenge,
      rules: [
        {
          type: "unknown-rule-type",
          selector: "div",
          message: "broken",
        },
        ...validChallenge.rules,
      ],
    };
    expect(challengeSchema.safeParse(invalid).success).toBe(false);
  });

  it("fails when unexpected extra keys are provided on challenge or rules (strict mode)", () => {
    // Extra key on challenge
    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        extraProperty: "not-allowed",
      }).success
    ).toBe(false);

    // Extra key on a rule
    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        rules: [
          {
            type: "element-exists",
            selector: "html",
            min: 1,
            message: "Must have html",
            unknownField: 123,
          },
          validChallenge.rules[1],
        ],
      }).success
    ).toBe(false);
  });

  it("fails when rules count is less than 2", () => {
    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        rules: [validChallenge.rules[0]],
      }).success
    ).toBe(false);
  });

  it("fails when hints count is 0 or exceeds 3", () => {
    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        hints: [],
      }).success
    ).toBe(false);

    expect(
      challengeSchema.safeParse({
        ...validChallenge,
        hints: ["h1", "h2", "h3", "h4"],
      }).success
    ).toBe(false);
  });
});
