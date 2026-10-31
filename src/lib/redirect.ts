/**
 * Validates and sanitizes redirect destination paths to prevent open redirect vulnerabilities.
 * Only allows same-origin relative paths (e.g. "/dashboard", "/lessons/html-structure").
 * Blocks protocol-relative ("//evil.com"), backslash bypasses ("/\evil.com"), and invalid URLs.
 */
export function getSafeRedirect(
  target: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!target || typeof target !== "string") {
    return fallback;
  }

  const trimmed = target.trim();

  // Must begin with a single slash and must NOT start with "//" or "/\"
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\")
  ) {
    return fallback;
  }

  // Reject CRLF, tab, or null byte injection
  if (/[\r\n\0\t]/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}
