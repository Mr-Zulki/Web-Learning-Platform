import { describe, it, expect } from "vitest";
import {
  normalizeCssValue,
  parseCssDeclarations,
} from "@/lib/checker/css-query";

describe("css-query", () => {
  it("normalizes CSS values properly", () => {
    // Hex normalization
    expect(normalizeCssValue("#FFF")).toBe("#ffffff");
    expect(normalizeCssValue("#16A34A")).toBe("#16a34a");
    expect(normalizeCssValue("#abc")).toBe("#aabbcc");

    // Zero unit normalization
    expect(normalizeCssValue("0px")).toBe("0");
    expect(normalizeCssValue("0rem")).toBe("0");
    expect(normalizeCssValue("0%")).toBe("0");
    expect(normalizeCssValue("0")).toBe("0");

    // Whitespace collapse and lowercase
    expect(normalizeCssValue("  2px   SOLID   #2563EB  ")).toBe(
      "2px solid #2563eb"
    );
    expect(normalizeCssValue("BORDER-BOX")).toBe("border-box");
  });

  it("parses CSS declarations by selector", () => {
    const css = `
      #banner {
        color: #2563EB;
        font-size: 20px;
        margin: 0px;
      }
      .card, div.card {
        padding: 16px;
        border: 2px solid #fff;
        box-sizing: border-box;
      }
    `;

    const decls = parseCssDeclarations(css);

    // #banner selector
    expect(decls["#banner"]).toBeDefined();
    expect(decls["#banner"]!["color"]).toBe("#2563eb");
    expect(decls["#banner"]!["font-size"]).toBe("20px");
    expect(decls["#banner"]!["margin"]).toBe("0");

    // Multiple selectors
    expect(decls[".card"]).toBeDefined();
    expect(decls[".card"]!["padding"]).toBe("16px");
    expect(decls[".card"]!["border"]).toBe("2px solid #ffffff");
    expect(decls[".card"]!["box-sizing"]).toBe("border-box");

    expect(decls["div.card"]).toBeDefined();
    expect(decls["div.card"]!["padding"]).toBe("16px");
  });

  it("handles malformed and empty CSS gracefully without throwing", () => {
    expect(parseCssDeclarations("")).toEqual({});
    expect(parseCssDeclarations("invalid {{{ css @@@")).toEqual({});
  });
});
