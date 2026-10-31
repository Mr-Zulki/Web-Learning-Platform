import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { checkSubmission } from "@/lib/checker";
import { challengeSchema, type Challenge } from "@/lib/challenge-schema";
import { MAX_CODE_LENGTH } from "@/lib/preview";

describe("checker integration", () => {
  const challengesDir = path.join(process.cwd(), "src/content/challenges");
  const solutionsDir = path.join(process.cwd(), "tests/fixtures/solutions");

  const challengeFiles = [
    "challenge-html-structure.json",
    "challenge-text-tags.json",
    "challenge-links-and-images.json",
    "challenge-css-selectors.json",
    "challenge-box-model.json",
  ];

  it("passes each of the 5 challenges using its known-good solution", () => {
    for (const fileName of challengeFiles) {
      const challengeRaw = JSON.parse(
        fs.readFileSync(path.join(challengesDir, fileName), "utf-8")
      );
      const challenge: Challenge = challengeSchema.parse(challengeRaw);

      const solutionRaw = JSON.parse(
        fs.readFileSync(path.join(solutionsDir, fileName), "utf-8")
      );

      const result = checkSubmission(solutionRaw, challenge);

      expect(
        result.passed,
        `Challenge ${challenge.id} failed with known-good solution: ${JSON.stringify(
          result.results.filter((r) => !r.passed)
        )}`
      ).toBe(true);

      expect(result.score.passed).toBe(result.score.total);
      expect(result.score.total).toBe(challenge.rules.length);
      expect(result.results.every((r) => r.passed)).toBe(true);
    }
  });

  it("fails when an empty submission is evaluated", () => {
    const challengeRaw = JSON.parse(
      fs.readFileSync(
        path.join(challengesDir, "challenge-html-structure.json"),
        "utf-8"
      )
    );
    const challenge: Challenge = challengeSchema.parse(challengeRaw);

    const result = checkSubmission({ html: "", css: "" }, challenge);
    expect(result.passed).toBe(false);
    expect(result.score.passed).toBeLessThan(result.score.total);
    expect(result.results.some((r) => !r.passed)).toBe(true);
  });

  it("reports exact failure messages on partially correct submissions", () => {
    const challengeRaw = JSON.parse(
      fs.readFileSync(
        path.join(challengesDir, "challenge-text-tags.json"),
        "utf-8"
      )
    );
    const challenge: Challenge = challengeSchema.parse(challengeRaw);

    // Provide h1 and one p, but missing second p and ul/li/strong
    const partialInput = {
      html: "<h1>Title Only</h1><p>One paragraph</p>",
      css: "",
    };

    const result = checkSubmission(partialInput, challenge);
    expect(result.passed).toBe(false);

    // Rule 0 (h1 count 1) should pass
    expect(result.results[0]?.passed).toBe(true);

    // Rule 1 (p count at least 2) should fail
    expect(result.results[1]?.passed).toBe(false);
    expect(result.results[1]?.message).toBe(
      "Page must contain at least two <p> paragraph elements."
    );

    // Rule 2 (ul exists) should fail
    expect(result.results[2]?.passed).toBe(false);
    expect(result.results[2]?.message).toBe(
      "Page must contain an unordered list <ul>."
    );
  });

  it("handles malformed garbage input safely without throwing", () => {
    const challengeRaw = JSON.parse(
      fs.readFileSync(
        path.join(challengesDir, "challenge-box-model.json"),
        "utf-8"
      )
    );
    const challenge: Challenge = challengeSchema.parse(challengeRaw);

    const garbage = {
      html: "<<<<div class='broken'>> unclosed <p>>>",
      css: "body { broken @@@ }}} .card {{ ;;;",
    };

    let result: ReturnType<typeof checkSubmission> | null = null;
    expect(() => {
      result = checkSubmission(garbage, challenge);
    }).not.toThrow();

    expect(result).not.toBeNull();
    expect(result!.passed).toBe(false);
    expect(result!.score.total).toBe(challenge.rules.length);
  });

  it("fails cleanly when submission exceeds MAX_CODE_LENGTH", () => {
    const challengeRaw = JSON.parse(
      fs.readFileSync(
        path.join(challengesDir, "challenge-html-structure.json"),
        "utf-8"
      )
    );
    const challenge: Challenge = challengeSchema.parse(challengeRaw);

    const overlimitInput = {
      html: "a".repeat(MAX_CODE_LENGTH + 10),
      css: "body {}",
    };

    const result = checkSubmission(overlimitInput, challenge);
    expect(result.passed).toBe(false);
    expect(result.score.passed).toBe(0);
    expect(result.results[0]?.message).toContain(
      "Submission exceeds maximum allowed length"
    );
  });

  it("fails cleanly on pathological deep DOM complexity (>5,000 nodes)", () => {
    const challengeRaw = JSON.parse(
      fs.readFileSync(
        path.join(challengesDir, "challenge-html-structure.json"),
        "utf-8"
      )
    );
    const challenge: Challenge = challengeSchema.parse(challengeRaw);

    // 2,600 paragraphs with text generate 5,200+ nodes while staying under 20k chars
    const deepHtml = "<p>0</p>".repeat(2600);
    const result = checkSubmission({ html: deepHtml, css: "" }, challenge);

    expect(result.passed).toBe(false);
    expect(result.results[0]?.message).toContain("5,000 DOM nodes");
  });
});
