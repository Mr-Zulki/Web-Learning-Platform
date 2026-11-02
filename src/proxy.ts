import { NextRequest, NextResponse } from "next/server";
import os from "node:os";
import { auth } from "@/lib/auth";
import { getSafeRedirect } from "@/lib/redirect";

/**
 * Next.js 16 proxy function (Next.js 16 renamed middleware → proxy).
 * Named export `proxy` is what Next.js 16 / Turbopack expects in src/proxy.ts.
 *
 * Responsibilities:
 *  1. Inject X-Served-By header (replica identity for debugging).
 *  2. Protect /dashboard and any future /dashboard/* routes:
 *     unauthenticated requests are redirected to /login?next=<path>.
 */

/** Paths that require an authenticated session. */
const PROTECTED_PREFIXES = ["/dashboard"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always set the replica-identity header.
  const response = NextResponse.next();
  response.headers.set("X-Served-By", os.hostname());

  // 2. Guard protected routes.
  if (isProtected(pathname)) {
    const session = await auth();
    if (!session?.user?.id) {
      // Build the redirect URL, validating the next param to prevent open-redirect.
      const next = getSafeRedirect(pathname, "/dashboard");
      const loginUrl = new URL(`/login?next=${encodeURIComponent(next)}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

/**
 * Route matcher — keep this tight so middleware only runs where needed.
 * Static assets (_next/static, _next/image, favicons) are excluded.
 */
export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static  (static files)
     *  - _next/image   (Next.js image optimisation)
     *  - favicon.ico, robots.txt, sitemap.xml
     *  - /api routes (handled by their own auth guards)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/).*)",
  ],
};
