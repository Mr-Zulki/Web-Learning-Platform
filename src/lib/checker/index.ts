import type { Challenge } from "@/lib/challenge-schema";
import { MAX_CODE_LENGTH } from "@/lib/preview";
import { parseHtmlDocument } from "./html-query";
import { parseCssDeclarations } from "./css-query";
import { evaluateRule } from "./rules";

export interface SubmissionInput {
  html: string;
  css: string;
}

export interface RuleResult {
  ruleIndex: number;
  passed: boolean;
  message: string;
}

export interface CheckResult {
  passed: boolean;
  results: RuleResult[];
  score: {
    passed: number;
    total: number;
  };
}

export function checkSubmission(
  submission: SubmissionInput,
  challenge: Challenge
): CheckResult {
  const total = challenge.rules.length;

  // 1. Length check guard
  if (
    (submission.html && submission.html.length > MAX_CODE_LENGTH) ||
    (submission.css && submission.css.length > MAX_CODE_LENGTH)
  ) {
    return {
      passed: false,
      results: challenge.rules.map((rule, idx) => ({
        ruleIndex: idx,
        passed: false,
        message: `Submission exceeds maximum allowed length of ${MAX_CODE_LENGTH.toLocaleString()} characters.`,
      })),
      score: {
        passed: 0,
        total,
      },
    };
  }

  // 2. Parse HTML and check for pathological node count bailout
  const htmlCtx = parseHtmlDocument(submission.html || "");
  if (htmlCtx.nodeLimitExceeded) {
    return {
      passed: false,
      results: challenge.rules.map((rule, idx) => ({
        ruleIndex: idx,
        passed: false,
        message:
          "Submission exceeds maximum allowed document complexity (5,000 DOM nodes).",
      })),
      score: {
        passed: 0,
        total,
      },
    };
  }

  // 3. Parse CSS declarations
  const cssDecl = parseCssDeclarations(submission.css || "");

  // 4. Evaluate each rule safely
  let passedCount = 0;
  const results: RuleResult[] = [];

  for (let idx = 0; idx < challenge.rules.length; idx++) {
    const rule = challenge.rules[idx];
    if (!rule) continue;

    let passed = false;
    try {
      passed = evaluateRule(rule, htmlCtx, cssDecl);
    } catch {
      passed = false;
    }

    if (passed) {
      passedCount++;
    }

    results.push({
      ruleIndex: idx,
      passed,
      message: rule.message,
    });
  }

  return {
    passed: passedCount === total,
    results,
    score: {
      passed: passedCount,
      total,
    },
  };
}
