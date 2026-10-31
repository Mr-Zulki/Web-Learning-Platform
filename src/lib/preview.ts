export const MAX_CODE_LENGTH = 50_000;

export const PREVIEW_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; img-src data: https:; font-src data: https:; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none';";

export const CSP_META_TAG = `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">`;

export const RESET_CSS =
  "body { margin: 8px; font-family: system-ui, -apple-system, sans-serif; }";

export interface PreviewOptions {
  html: string;
  css: string;
}

export interface PreviewResult {
  document: string;
  truncated: boolean;
}

export function escapeCss(css: string): string {
  return css.replace(/<\/style/gi, "<\\/style");
}

export function buildPreviewDocument({
  html,
  css,
}: PreviewOptions): PreviewResult {
  let truncated = false;
  let safeHtml = html;
  let safeCss = css;

  if (safeHtml.length > MAX_CODE_LENGTH) {
    safeHtml = safeHtml.slice(0, MAX_CODE_LENGTH);
    truncated = true;
  }

  if (safeCss.length > MAX_CODE_LENGTH) {
    safeCss = safeCss.slice(0, MAX_CODE_LENGTH);
    truncated = true;
  }

  const escapedCss = escapeCss(safeCss);
  const styleTag = `<style>\n${RESET_CSS}\n${escapedCss}\n</style>`;

  const hasHtmlTag = /<html[\s>]/i.test(safeHtml);
  const hasHeadTag = /<head[\s>]/i.test(safeHtml);
  const hasBodyTag = /<body[\s>]/i.test(safeHtml);

  let doc: string;

  if (hasHtmlTag || hasHeadTag || hasBodyTag) {
    doc = safeHtml;

    if (hasHeadTag) {
      // Inject CSP meta tag as the first element in <head>
      doc = doc.replace(/(<head[^>]*>)/i, `$1\n${CSP_META_TAG}`);

      // Inject style before </head> if exists, else before <body> or at the end
      if (/<\/head>/i.test(doc)) {
        doc = doc.replace(/<\/head>/i, `${styleTag}\n</head>`);
      } else if (hasBodyTag) {
        doc = doc.replace(/(<body[^>]*>)/i, `${styleTag}\n$1`);
      } else {
        doc += `\n${styleTag}`;
      }
    } else if (hasHtmlTag) {
      // <head> is missing: create <head> right after <html>
      const headBlock = `<head>\n${CSP_META_TAG}\n${styleTag}\n</head>`;
      doc = doc.replace(/(<html[^>]*>)/i, `$1\n${headBlock}`);
    } else {
      // Only <body> is present: wrap with <!DOCTYPE html><html lang="en"><head>...
      const headBlock = `<!DOCTYPE html>\n<html lang="en">\n<head>\n${CSP_META_TAG}\n${styleTag}\n</head>`;
      doc = `${headBlock}\n${doc}\n</html>`;
    }

    if (!/<!doctype html>/i.test(doc)) {
      doc = `<!DOCTYPE html>\n${doc}`;
    }
  } else {
    // Pure fragment
    doc = `<!DOCTYPE html>
<html lang="en">
<head>
${CSP_META_TAG}
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Live Preview</title>
${styleTag}
</head>
<body>
${safeHtml}
</body>
</html>`;
  }

  return {
    document: doc,
    truncated,
  };
}
