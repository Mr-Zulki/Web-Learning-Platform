import { describe, it, expect } from "vitest";
import { getSafeRedirect } from "@/lib/redirect";

describe("open redirect validator (getSafeRedirect)", () => {
  it("allows safe relative paths", () => {
    expect(getSafeRedirect("/dashboard")).toBe("/dashboard");
    expect(getSafeRedirect("/lessons/html-structure")).toBe(
      "/lessons/html-structure"
    );
    expect(getSafeRedirect("/lessons?page=2")).toBe("/lessons?page=2");
  });

  it("blocks external protocol-relative URLs", () => {
    expect(getSafeRedirect("//evil.com")).toBe("/dashboard");
    expect(getSafeRedirect("//google.com/phishing")).toBe("/dashboard");
  });

  it("blocks Windows backslash bypasses", () => {
    expect(getSafeRedirect("/\\evil.com")).toBe("/dashboard");
    expect(getSafeRedirect("/\\/evil.com")).toBe("/dashboard");
  });

  it("blocks absolute URLs", () => {
    expect(getSafeRedirect("https://evil.com")).toBe("/dashboard");
    expect(getSafeRedirect("http://evil.com/login")).toBe("/dashboard");
    expect(getSafeRedirect("javascript:alert(1)")).toBe("/dashboard");
  });

  it("blocks CRLF and control characters", () => {
    expect(getSafeRedirect("/dashboard\r\nSet-Cookie:bad=1")).toBe(
      "/dashboard"
    );
    expect(getSafeRedirect("/dashboard\0")).toBe("/dashboard");
  });

  it("falls back to custom fallback if provided", () => {
    expect(getSafeRedirect("https://evil.com", "/lessons")).toBe("/lessons");
    expect(getSafeRedirect(null, "/lessons")).toBe("/lessons");
    expect(getSafeRedirect("", "/lessons")).toBe("/lessons");
  });
});
