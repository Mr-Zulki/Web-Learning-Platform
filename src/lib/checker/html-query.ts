import * as parse5 from "parse5";

export interface ParsedSelector {
  tag?: string;
  className?: string;
  id?: string;
}

export const MAX_DOM_NODES = 5000;

export function parseSimpleSelector(selector: string): ParsedSelector {
  const trimmed = selector.trim();
  if (trimmed.startsWith("#")) {
    return { id: trimmed.slice(1) };
  }
  if (trimmed.startsWith(".")) {
    return { className: trimmed.slice(1) };
  }
  if (trimmed.includes(".")) {
    const [tag, className] = trimmed.split(".");
    return {
      tag: tag ? tag.toLowerCase() : undefined,
      className,
    };
  }
  return { tag: trimmed.toLowerCase() };
}

export type Parse5Node = parse5.DefaultTreeAdapterMap["node"];
export type Parse5Element = parse5.DefaultTreeAdapterMap["element"];
export type Parse5TextNode = parse5.DefaultTreeAdapterMap["textNode"];

function isElement(node: Parse5Node): node is Parse5Element {
  return (
    "tagName" in node && typeof (node as Parse5Element).tagName === "string"
  );
}

function isTextNode(node: Parse5Node): node is Parse5TextNode {
  return node.nodeName === "#text" && "value" in node;
}

export function getAttribute(
  node: Parse5Node,
  attrName: string
): string | null {
  if (!isElement(node)) return null;
  const match = node.attrs.find(
    (a) => a.name.toLowerCase() === attrName.toLowerCase()
  );
  return match ? match.value : null;
}

export function matchesSelector(
  node: Parse5Node,
  selector: ParsedSelector
): boolean {
  if (!isElement(node)) return false;

  if (selector.tag && node.tagName.toLowerCase() !== selector.tag) {
    return false;
  }

  if (selector.id) {
    const idVal = getAttribute(node, "id");
    if (idVal !== selector.id) {
      return false;
    }
  }

  if (selector.className) {
    const classVal = getAttribute(node, "class");
    if (!classVal) return false;
    const classes = classVal.trim().split(/\s+/);
    if (!classes.includes(selector.className)) {
      return false;
    }
  }

  return true;
}

export function getTextContent(node: Parse5Node): string {
  if (isTextNode(node)) {
    return node.value;
  }
  if (!("childNodes" in node) || !Array.isArray(node.childNodes)) {
    return "";
  }
  return node.childNodes.map(getTextContent).join("");
}

export interface HtmlQueryContext {
  root: Parse5Node;
  parentMap: Map<Parse5Node, Parse5Node>;
  totalNodes: number;
  nodeLimitExceeded: boolean;
}

export function parseHtmlDocument(html: string): HtmlQueryContext {
  let root: Parse5Node;
  try {
    root = parse5.parse(html);
  } catch {
    root = parse5.parseFragment("");
  }

  const parentMap = new Map<Parse5Node, Parse5Node>();
  let totalNodes = 0;
  let nodeLimitExceeded = false;

  function traverse(node: Parse5Node) {
    totalNodes++;
    if (totalNodes > MAX_DOM_NODES) {
      nodeLimitExceeded = true;
      return;
    }
    if ("childNodes" in node && Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        parentMap.set(child, node);
        traverse(child);
        if (nodeLimitExceeded) return;
      }
    }
  }

  traverse(root);

  return {
    root,
    parentMap,
    totalNodes,
    nodeLimitExceeded,
  };
}

export function querySelectorAll(
  ctx: HtmlQueryContext,
  selectorString: string
): Parse5Element[] {
  if (ctx.nodeLimitExceeded) {
    return [];
  }
  const selector = parseSimpleSelector(selectorString);
  const matches: Parse5Element[] = [];

  function traverse(node: Parse5Node) {
    if (isElement(node) && matchesSelector(node, selector)) {
      matches.push(node);
    }
    if ("childNodes" in node && Array.isArray(node.childNodes)) {
      for (const child of node.childNodes) {
        traverse(child);
      }
    }
  }

  traverse(ctx.root);
  return matches;
}

export function isChildOf(
  node: Parse5Node,
  parentSelectorString: string,
  parentMap: Map<Parse5Node, Parse5Node>
): boolean {
  const parentSelector = parseSimpleSelector(parentSelectorString);
  let current: Parse5Node | undefined = parentMap.get(node);

  while (current) {
    if (matchesSelector(current, parentSelector)) {
      return true;
    }
    current = parentMap.get(current);
  }

  return false;
}
