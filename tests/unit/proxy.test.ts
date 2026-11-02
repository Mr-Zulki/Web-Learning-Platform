import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";

// vi.mock is hoisted before imports, so @/lib/auth is mocked before proxy.ts loads it.
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
  requireUser: vi.fn(),
}));

// Import the mocked module to get a typed reference for mockResolvedValue calls.
import * as authLib from "@/lib/auth";
import { proxy as middleware } from "@/proxy";

// Typed helper — auth is mocked as a plain async fn, cast appropriately.
const mockAuth = authLib.auth as ReturnType<typeof vi.fn>;

const SESSION: Session = {
  user: { id: "usr_123", email: "test@example.com", name: "Test" },
  expires: "2099-01-01",
};

describe("proxy middleware — dashboard guard", () => {
  beforeEach(() => {
    mockAuth.mockReset();
  });

  it("allows unauthenticated request to public route /lessons", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/lessons");
    const res = await middleware(req);
    expect(res.status).not.toBe(307);
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects unauthenticated user from /dashboard to /login?next=%2Fdashboard", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain("/login");
    expect(location).toContain(encodeURIComponent("/dashboard"));
  });

  it("redirects unauthenticated user from /dashboard/settings with correct next param", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/dashboard/settings");
    const res = await middleware(req);
    expect(res.status).toBe(307);
    const location = res.headers.get("location") ?? "";
    expect(location).toContain(encodeURIComponent("/dashboard/settings"));
  });

  it("allows authenticated user through /dashboard without redirect", async () => {
    mockAuth.mockResolvedValue(SESSION);
    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await middleware(req);
    expect(res.status).not.toBe(307);
    expect(res.headers.get("location")).toBeNull();
  });

  it("sets X-Served-By header on every response", async () => {
    mockAuth.mockResolvedValue(null);
    const req = new NextRequest("http://localhost:3000/lessons");
    const res = await middleware(req);
    expect(res.headers.get("x-served-by")).toBeTruthy();
  });
});
