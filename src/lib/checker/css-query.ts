import * as csstree from "css-tree";

export function normalizeCssValue(value: string): string {
  let val = value.trim().toLowerCase();

  // Collapse multiple whitespaces into a single space
  val = val.replace(/\s+/g, " ");

  // Normalize 3-digit hex colors #rgb to #rrggbb
  val = val.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi, "#$1$1$2$2$3$3");

  // Normalize 0 with units (0px, 0em, 0rem, 0%) to 0
  val = val.replace(/(?:\b0(?:px|em|rem)\b|0%)/g, "0");

  // Strip unnecessary quotes
  val = val.replace(/['"]/g, "");

  return val;
}

export interface CssDeclarations {
  [selector: string]: { [property: string]: string };
}

export function parseCssDeclarations(css: string): CssDeclarations {
  const result: CssDeclarations = {};

  let ast: csstree.CssNode;
  try {
    ast = csstree.parse(css, { parseCustomProperty: true });
  } catch {
    return result;
  }

  csstree.walk(ast, {
    visit: "Rule",
    enter(node) {
      if (!node.prelude || !node.block) return;
      const selectorRaw = csstree.generate(node.prelude);

      // Split multiple selectors
      const selectors = selectorRaw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      csstree.walk(node.block, {
        visit: "Declaration",
        enter(decl) {
          const prop = decl.property.toLowerCase().trim();
          const rawVal = csstree.generate(decl.value);
          const normalizedVal = normalizeCssValue(rawVal);

          for (const sel of selectors) {
            if (!result[sel]) {
              result[sel] = {};
            }
            result[sel][prop] = normalizedVal;
          }
        },
      });
    },
  });

  return result;
}
