import { describe, it, expect } from "vitest";
import {
  parseHtmlDocument,
  parseSimpleSelector,
  querySelectorAll,
  getAttribute,
  getTextContent,
  isChildOf,
} from "@/lib/checker/html-query";

describe("html-query", () => {
  it("parses simple selector grammar accurately", () => {
    expect(parseSimpleSelector("h1")).toEqual({ tag: "h1" });
    expect(parseSimpleSelector(".card")).toEqual({ className: "card" });
    expect(parseSimpleSelector("#banner")).toEqual({ id: "banner" });
    expect(parseSimpleSelector("div.card")).toEqual({
      tag: "div",
      className: "card",
    });
  });

  it("extracts elements and attributes matching various selectors", () => {
    const html = `
      <div id="banner" class="wrapper main-box">
        <h1 class="title">Main Heading</h1>
        <p class="desc">First paragraph</p>
        <p class="desc special">Second paragraph with <a href="https://example.com" target="_blank">link</a></p>
      </div>
    `;

    const ctx = parseHtmlDocument(html);

    // Tag selector
    const h1Nodes = querySelectorAll(ctx, "h1");
    expect(h1Nodes).toHaveLength(1);
    expect(getTextContent(h1Nodes[0]!)).toBe("Main Heading");

    // ID selector
    const idNodes = querySelectorAll(ctx, "#banner");
    expect(idNodes).toHaveLength(1);
    expect(getAttribute(idNodes[0]!, "id")).toBe("banner");
    expect(getAttribute(idNodes[0]!, "class")).toBe("wrapper main-box");

    // Class selector
    const descNodes = querySelectorAll(ctx, ".desc");
    expect(descNodes).toHaveLength(2);

    // Tag.class selector
    const specialP = querySelectorAll(ctx, "p.special");
    expect(specialP).toHaveLength(1);

    // Attribute extraction
    const linkNodes = querySelectorAll(ctx, "a");
    expect(linkNodes).toHaveLength(1);
    expect(getAttribute(linkNodes[0]!, "href")).toBe("https://example.com");
    expect(getAttribute(linkNodes[0]!, "nonexistent")).toBeNull();
  });

  it("checks parent-child hierarchy with isChildOf", () => {
    const html = `
      <section id="hero">
        <div class="container">
          <h2 class="title">Nested Title</h2>
        </div>
      </section>
      <footer>
        <h2 class="footer-title">Footer Title</h2>
      </footer>
    `;

    const ctx = parseHtmlDocument(html);
    const titles = querySelectorAll(ctx, "h2");
    expect(titles).toHaveLength(2);

    const nestedTitle = titles[0]!;
    const footerTitle = titles[1]!;

    expect(isChildOf(nestedTitle, ".container", ctx.parentMap)).toBe(true);
    expect(isChildOf(nestedTitle, "#hero", ctx.parentMap)).toBe(true);
    expect(isChildOf(nestedTitle, "section", ctx.parentMap)).toBe(true);
    expect(isChildOf(nestedTitle, "footer", ctx.parentMap)).toBe(false);

    expect(isChildOf(footerTitle, "footer", ctx.parentMap)).toBe(true);
    expect(isChildOf(footerTitle, "#hero", ctx.parentMap)).toBe(false);
  });

  it("handles malformed markup and empty strings gracefully without throwing", () => {
    const emptyCtx = parseHtmlDocument("");
    expect(emptyCtx.totalNodes).toBeGreaterThan(0); // Document node
    expect(querySelectorAll(emptyCtx, "div")).toHaveLength(0);

    const malformed = "<div class=broken><p unclosed>>>>>";
    const malformedCtx = parseHtmlDocument(malformed);
    expect(malformedCtx.nodeLimitExceeded).toBe(false);
    expect(querySelectorAll(malformedCtx, "p").length).toBeGreaterThan(0);
  });

  it("triggers safety limit when node count exceeds 5,000 nodes", () => {
    // 2,600 elements with text produce over 5,200 nodes without pathological nesting delays
    const deepHtml = "<p>0</p>".repeat(2600);
    const ctx = parseHtmlDocument(deepHtml);
    expect(ctx.nodeLimitExceeded).toBe(true);
    expect(querySelectorAll(ctx, "div")).toHaveLength(0);
  });
});
