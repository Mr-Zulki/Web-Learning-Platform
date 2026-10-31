import { describe, it, expect } from "vitest";
import {
  buildPreviewDocument,
  escapeCss,
  MAX_CODE_LENGTH,
  PREVIEW_CSP,
  CSP_META_TAG,
  RESET_CSS,
} from "@/lib/preview";

describe("buildPreviewDocument", () => {
  it("wraps bare HTML fragments in a valid document skeleton", () => {
    const result = buildPreviewDocument({
      html: "<h1>Hello World</h1>",
      css: "h1 { color: red; }",
    });

    expect(result.truncated).toBe(false);
    expect(result.document).toContain("<!DOCTYPE html>");
    expect(result.document).toContain('<html lang="en">');
    expect(result.document).toContain("<head>");
    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain(RESET_CSS);
    expect(result.document).toContain("h1 { color: red; }");
    expect(result.document).toContain("<h1>Hello World</h1>");
  });

  it("injects CSP meta and style into an existing full document with head", () => {
    const fullHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Original Title</title>
  </head>
  <body>
    <p>User body</p>
  </body>
</html>`;

    const result = buildPreviewDocument({
      html: fullHtml,
      css: "p { font-size: 18px; }",
    });

    expect(result.truncated).toBe(false);
    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain("<title>Original Title</title>");
    expect(result.document).toContain("p { font-size: 18px; }");

    // Verify CSP is the first element inside <head>
    const headIndex = result.document.indexOf("<head>");
    const cspIndex = result.document.indexOf(CSP_META_TAG);
    const titleIndex = result.document.indexOf("<title>Original Title</title>");

    expect(cspIndex).toBeGreaterThan(headIndex);
    expect(cspIndex).toBeLessThan(titleIndex);
  });

  it("creates a head element if html is present but head is missing", () => {
    const noHeadHtml = `<html><body><main>Content</main></body></html>`;
    const result = buildPreviewDocument({
      html: noHeadHtml,
      css: "main { padding: 10px; }",
    });

    expect(result.document).toContain("<head>");
    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain("main { padding: 10px; }");
  });

  it("wraps code when only body tag is present", () => {
    const bodyOnly = `<body><p>Just body</p></body>`;
    const result = buildPreviewDocument({
      html: bodyOnly,
      css: "p { margin: 0; }",
    });

    expect(result.document).toContain("<!DOCTYPE html>");
    expect(result.document).toContain("<head>");
    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain("<p>Just body</p>");
  });

  it("escapes </style to prevent style breakout and script injection", () => {
    const maliciousCss = `body { background: black; } </style><script>alert(1)</script>`;
    const escaped = escapeCss(maliciousCss);

    expect(escaped).not.toContain("</style");
    expect(escaped).toContain("<\\/style");

    const result = buildPreviewDocument({
      html: "<div>Content</div>",
      css: maliciousCss,
    });

    // Ensure the document does not close the style tag early
    const openStyleCount = (result.document.match(/<style>/gi) || []).length;
    const closeStyleCount = (result.document.match(/<\/style>/gi) || []).length;
    expect(openStyleCount).toBe(1);
    expect(closeStyleCount).toBe(1);
  });

  it("handles unclosed head tag with body tag present", () => {
    const unclosedHead = `<head><meta charset="utf-8"><body><p>Content</p></body>`;
    const result = buildPreviewDocument({
      html: unclosedHead,
      css: "p { color: red; }",
    });

    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain("p { color: red; }");
  });

  it("handles head tag without closing head and without body tag", () => {
    const headOnly = `<head><title>No body</title>`;
    const result = buildPreviewDocument({
      html: headOnly,
      css: "body { background: white; }",
    });

    expect(result.document).toContain(CSP_META_TAG);
    expect(result.document).toContain("body { background: white; }");
  });

  it("truncates input exceeding MAX_CODE_LENGTH and flags truncated as true", () => {
    const largeHtml = "a".repeat(MAX_CODE_LENGTH + 500);
    const normalCss = "body { color: blue; }";

    const result = buildPreviewDocument({
      html: largeHtml,
      css: normalCss,
    });

    expect(result.truncated).toBe(true);
    // The truncated html should have length MAX_CODE_LENGTH
    expect(result.document).not.toContain("a".repeat(MAX_CODE_LENGTH + 1));

    const largeCss = "b".repeat(MAX_CODE_LENGTH + 100);
    const result2 = buildPreviewDocument({
      html: "<p>Hi</p>",
      css: largeCss,
    });
    expect(result2.truncated).toBe(true);
  });

  it("verifies CSP policy tokens and reset CSS order before user CSS", () => {
    const result = buildPreviewDocument({
      html: "<div>Content</div>",
      css: "div { display: flex; }",
    });

    expect(result.document).toContain(PREVIEW_CSP);
    const resetIndex = result.document.indexOf(RESET_CSS);
    const userCssIndex = result.document.indexOf("div { display: flex; }");
    expect(resetIndex).toBeLessThan(userCssIndex);
  });
});
