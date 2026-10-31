# Testing Strategy & Guidelines

## Overview

The platform uses **Vitest** with the `@testing-library/react` and `jsdom` environment for unit and component testing, and **v8** for coverage collection. All tests reside in `tests/unit/`.

Run the test suite:

```bash
npm test                 # Run all unit tests
npm run test:watch       # Interactive watch mode
npm run test:coverage    # Generate v8 test coverage report
```

---

## Static Analysis Checker Testing Strategy

The challenge verification engine in `src/lib/checker/` is tested through multiple layered test suites:

1. **HTML Query Suite (`tests/unit/html-query.test.ts`)**:
   - Selector matching for tag (`h1`), class (`.desc`), ID (`#banner`), and tag with class (`p.special`).
   - Attribute extraction and case handling.
   - Text extraction across nested children.
   - Hierarchy traversal (`isChildOf`) validating ancestor/descendant relationships.
   - Graceful handling of malformed markup (`<div class=broken><p unclosed>>>>`).
   - Complexity limit enforcement triggering safely when node count exceeds `MAX_DOM_NODES` (5,000 nodes).

2. **CSS Query Suite (`tests/unit/css-query.test.ts`)**:
   - CSS AST parsing using `css-tree`.
   - Multi-declaration extraction and selector matching.
   - Value normalization:
     - Hex colors: `#FFF` → `#ffffff`
     - Zero units: `0px`, `0em`, `0rem`, `0%` → `0`
     - Whitespace and quotes stripping: `"Inter", sans-serif` → `Inter, sans-serif`.
   - Fault-tolerant parsing ignoring invalid CSS syntax without throwing errors.

3. **Rule Evaluators Suite (`tests/unit/rules.test.ts`)**:
   - Comprehensive unit testing for each of the 7 supported rule types:
     - `element-exists`
     - `element-count`
     - `text-contains`
     - `attribute-equals`
     - `attribute-exists`
     - `css-property`
     - `child-of`
   - Verifies both passing and failing assertions and confirms informative failure messages.

4. **Checker Integration Suite (`tests/unit/checker.test.ts`)**:
   - **Known-Good Solutions**: Iterates over all 5 challenges and verifies that each solution in `tests/fixtures/solutions/*.json` achieves a 100% pass score.
   - **Empty Submissions**: Verifies that empty submissions fail safely with explicit rule breakdown.
   - **Partial Submissions**: Verifies that partially completed solutions report exact failing messages.
   - **Garbage & Malformed Input**: Asserts that broken or nonsensical markup does not throw exceptions or crash.
   - **Size Limits**: Asserts that inputs exceeding `MAX_CODE_LENGTH` (50,000 characters) fail immediately without memory spikes.
   - **Pathological Nesting**: Asserts that inputs exceeding `MAX_DOM_NODES` (5,000 nodes) are cleanly rejected.

5. **Challenge Schema & Loader Suites (`tests/unit/challenge-schema.test.ts`, `tests/unit/challenges.test.ts`)**:
   - Validates that malformed or incomplete challenge JSON is rejected loudly at startup.
   - Bi-directional cross-validation: verifies that an unreferenced challenge or an orphan lesson reference throws a loud error.
   - Solution confidentiality: verifies that known-good solutions are never attached to client challenge models.

6. **UI Component Tests (`tests/unit/ChallengePanel.test.tsx`, `tests/unit/LessonWorkspace.test.tsx`)**:
   - Progressive disclosure of hints one by one until exhausted.
   - Immediate feedback upon clicking "Check my code" with accessible `aria-live="polite"` feedback.
   - Rendering of next-lesson navigation links upon passing (omitted on the final lesson).
   - Local `sessionStorage` caching of completed challenge state.

---

## How to Add a New Challenge

Follow these four steps to create and verify a new challenge:

### Step 1: Create the Challenge JSON

Create a new file in `src/content/challenges/` named `challenge-<lesson-id>.json`. Ensure it satisfies `ChallengeSchema`:

```json
{
  "id": "challenge-my-topic",
  "lessonId": "my-topic",
  "title": "Build a Custom Card",
  "task": "Create a `<div>` with class `card` containing an `<h2>` title and a `<p>` description.",
  "hints": [
    "Start by writing `<div class=\"card\">`.",
    "Place an `<h2>` element inside the card."
  ],
  "rules": [
    {
      "type": "element-exists",
      "selector": "div.card",
      "min": 1,
      "message": "Create a <div> with class \"card\"."
    },
    {
      "type": "child-of",
      "selector": "h2",
      "parent": "div.card",
      "message": "Place an <h2> heading inside the .card container."
    }
  ]
}
```

### Step 2: Link the Challenge from the Lesson

In `src/content/lessons/<lesson-id>.json`, set the `challengeId` property to match your challenge's `id`:

```json
{
  "id": "my-topic",
  "title": "My Topic",
  "order": 6,
  "challengeId": "challenge-my-topic",
  ...
}
```

### Step 3: Add Known-Good Solution Fixture

Create `tests/fixtures/solutions/challenge-<lesson-id>.json`. This file must contain an HTML/CSS combination that passes all defined rules:

```json
{
  "html": "<div class=\"card\"><h2>Title</h2><p>Description</p></div>",
  "css": ".card { padding: 16px; }"
}
```

> **Note**: Solution fixtures are exclusively stored in `tests/fixtures/solutions/` and are never imported into client-facing bundles.

### Step 4: Verify via Test Suite

Run the test suite to automatically validate the schema, execute bi-directional cross-validation, and verify the solution:

```bash
npm test
```
