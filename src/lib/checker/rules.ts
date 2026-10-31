import type { Rule } from "@/lib/challenge-schema";
import {
  querySelectorAll,
  getAttribute,
  getTextContent,
  isChildOf,
  type HtmlQueryContext,
} from "./html-query";
import { normalizeCssValue, type CssDeclarations } from "./css-query";

export function evaluateRule(
  rule: Rule,
  htmlCtx: HtmlQueryContext,
  cssDecl: CssDeclarations
): boolean {
  switch (rule.type) {
    case "element-exists": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      const minRequired = rule.min ?? 1;
      return elements.length >= minRequired;
    }

    case "element-count": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      if (rule.min !== undefined && elements.length < rule.min) {
        return false;
      }
      if (rule.max !== undefined && elements.length > rule.max) {
        return false;
      }
      return true;
    }

    case "text-contains": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      if (elements.length === 0) return false;

      return elements.some((el) => {
        const text = getTextContent(el);
        if (rule.caseSensitive) {
          return text.includes(rule.text);
        }
        return text.toLowerCase().includes(rule.text.toLowerCase());
      });
    }

    case "attribute-equals": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      if (elements.length === 0) return false;

      return elements.some((el) => {
        const val = getAttribute(el, rule.attribute);
        return val === rule.value;
      });
    }

    case "attribute-exists": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      if (elements.length === 0) return false;

      return elements.some((el) => {
        const val = getAttribute(el, rule.attribute);
        return val !== null && val.trim().length > 0;
      });
    }

    case "css-property": {
      const selectorKey = rule.selector.trim().toLowerCase();
      const selectorDeclarations = cssDecl[selectorKey];
      if (!selectorDeclarations) return false;

      const propKey = rule.property.trim().toLowerCase();
      const declaredVal = selectorDeclarations[propKey];
      if (!declaredVal) return false;

      const expectedVal = normalizeCssValue(rule.value);
      return declaredVal === expectedVal;
    }

    case "child-of": {
      const elements = querySelectorAll(htmlCtx, rule.selector);
      if (elements.length === 0) return false;

      return elements.some((el) =>
        isChildOf(el, rule.parent, htmlCtx.parentMap)
      );
    }
  }
}
