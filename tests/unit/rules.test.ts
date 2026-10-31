import { describe, it, expect } from "vitest";
import { parseHtmlDocument } from "@/lib/checker/html-query";
import { parseCssDeclarations } from "@/lib/checker/css-query";
import { evaluateRule } from "@/lib/checker/rules";

describe("rules evaluator", () => {
  const html = `
    <article id="post" class="card featured">
      <h1 class="headline">Breaking News</h1>
      <p class="summary">Read all about web standards and CSS.</p>
      <p class="author">By Jane Doe</p>
      <a href="https://example.com" target="_blank">Visit Site</a>
      <img src="/logo.png" alt="Company Logo" />
      <img src="/empty.png" alt="" />
    </article>
  `;

  const css = `
    .card {
      padding: 16px;
      border: 2px solid #2563EB;
      box-sizing: border-box;
      margin: 0px;
    }
    #post {
      color: #FFF;
    }
  `;

  const htmlCtx = parseHtmlDocument(html);
  const cssDecl = parseCssDeclarations(css);

  describe("element-exists", () => {
    it("passes when element exists matching minimum threshold", () => {
      expect(
        evaluateRule(
          {
            type: "element-exists",
            selector: "h1",
            min: 1,
            message: "Must have h1",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      expect(
        evaluateRule(
          {
            type: "element-exists",
            selector: "p",
            min: 2,
            message: "Must have at least 2 p",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);
    });

    it("fails when element count is below minimum required", () => {
      expect(
        evaluateRule(
          {
            type: "element-exists",
            selector: "footer",
            min: 1,
            message: "Must have footer",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "element-exists",
            selector: "h1",
            min: 2,
            message: "Must have 2 h1",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("element-count", () => {
    it("passes when count is within [min, max] range", () => {
      expect(
        evaluateRule(
          {
            type: "element-count",
            selector: "h1",
            min: 1,
            max: 1,
            message: "Exactly one h1",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      expect(
        evaluateRule(
          {
            type: "element-count",
            selector: "p",
            min: 1,
            max: 5,
            message: "1 to 5 paragraphs",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);
    });

    it("fails when count is outside boundaries", () => {
      expect(
        evaluateRule(
          {
            type: "element-count",
            selector: "p",
            max: 1,
            message: "At most 1 paragraph",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "element-count",
            selector: "h1",
            min: 2,
            message: "At least 2 h1",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("text-contains", () => {
    it("evaluates text containment with caseSensitivity support", () => {
      // Case insensitive (default)
      expect(
        evaluateRule(
          {
            type: "text-contains",
            selector: "h1",
            text: "breaking news",
            caseSensitive: false,
            message: "Must say breaking news",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // Case sensitive pass
      expect(
        evaluateRule(
          {
            type: "text-contains",
            selector: "h1",
            text: "Breaking News",
            caseSensitive: true,
            message: "Must say Breaking News exactly",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // Case sensitive fail
      expect(
        evaluateRule(
          {
            type: "text-contains",
            selector: "h1",
            text: "breaking news",
            caseSensitive: true,
            message: "Must say breaking news",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      // Missing element fail
      expect(
        evaluateRule(
          {
            type: "text-contains",
            selector: "h3",
            text: "anything",
            caseSensitive: false,
            message: "Must have h3",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("attribute-equals", () => {
    it("passes on exact attribute match and fails on mismatch", () => {
      expect(
        evaluateRule(
          {
            type: "attribute-equals",
            selector: "a",
            attribute: "target",
            value: "_blank",
            message: "Link opens in new tab",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      expect(
        evaluateRule(
          {
            type: "attribute-equals",
            selector: "a",
            attribute: "target",
            value: "_self",
            message: "Must be _self",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "attribute-equals",
            selector: "button",
            attribute: "type",
            value: "submit",
            message: "No button",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("attribute-exists", () => {
    it("passes when attribute exists and is non-empty, fails if missing or empty", () => {
      expect(
        evaluateRule(
          {
            type: "attribute-exists",
            selector: "a",
            attribute: "href",
            message: "Link has href",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // logo.png has alt="Company Logo" (non-empty)
      expect(
        evaluateRule(
          {
            type: "attribute-exists",
            selector: "img",
            attribute: "alt",
            message: "Image has alt",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      expect(
        evaluateRule(
          {
            type: "attribute-exists",
            selector: "a",
            attribute: "rel",
            message: "Link has rel",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "attribute-exists",
            selector: "aside",
            attribute: "id",
            message: "No aside",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("css-property", () => {
    it("validates css declarations with value normalization", () => {
      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".card",
            property: "padding",
            value: "16px",
            message: "Card has padding",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // Color normalization #2563EB vs #2563eb
      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".card",
            property: "border",
            value: "2px solid #2563eb",
            message: "Card has border",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // #FFF normalized to #ffffff
      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: "#post",
            property: "color",
            value: "#ffffff",
            message: "Post has white color",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      // 0px normalized to 0
      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".card",
            property: "margin",
            value: "0",
            message: "Card has 0 margin",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);
    });

    it("fails when property or selector does not match", () => {
      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".card",
            property: "padding",
            value: "20px",
            message: "Wrong padding",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".nonexistent",
            property: "color",
            value: "red",
            message: "Missing selector",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "css-property",
            selector: ".card",
            property: "font-size",
            value: "14px",
            message: "Missing property",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });

  describe("child-of", () => {
    it("passes when element is child of specified parent and fails otherwise", () => {
      expect(
        evaluateRule(
          {
            type: "child-of",
            selector: "h1",
            parent: "article",
            message: "h1 inside article",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(true);

      expect(
        evaluateRule(
          {
            type: "child-of",
            selector: "h1",
            parent: "footer",
            message: "h1 inside footer",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);

      expect(
        evaluateRule(
          {
            type: "child-of",
            selector: "button",
            parent: "article",
            message: "No button",
          },
          htmlCtx,
          cssDecl
        )
      ).toBe(false);
    });
  });
});
