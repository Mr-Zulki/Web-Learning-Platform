import { describe, it, expect } from "vitest";
import { getClientIp } from "@/lib/rate-limit";

describe("rate-limit client IP extraction", () => {
  // ── Vercel / production path ──────────────────────────────────────────────

  it("uses x-real-ip (Vercel-verified) over x-forwarded-for when both are present", () => {
    const headers = new Headers();
    // Attacker tries to spoof their IP by injecting a fake leading x-forwarded-for entry.
    headers.set("x-forwarded-for", "1.2.3.4, 10.0.0.1");
    // Vercel's edge network overwrites x-real-ip with the actual TCP remote address.
    headers.set("x-real-ip", "203.0.113.99");
    // Must use the verified x-real-ip, NOT the spoofed x-forwarded-for entry.
    expect(getClientIp(headers)).toBe("203.0.113.99");
  });

  it("spoofed x-forwarded-for leading entry does NOT bypass rate limit when x-real-ip is set", () => {
    const spoofedIp = "8.8.8.8"; // attacker's fake IP
    const realIp = "198.51.100.200"; // Vercel's verified client IP
    const headers = new Headers();
    headers.set("x-forwarded-for", `${spoofedIp}, 10.0.0.2`);
    headers.set("x-real-ip", realIp);
    // The rate-limit key should be built from realIp, NOT spoofedIp.
    expect(getClientIp(headers)).toBe(realIp);
    expect(getClientIp(headers)).not.toBe(spoofedIp);
  });

  it("uses x-real-ip when x-forwarded-for is absent", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "203.0.113.195");
    expect(getClientIp(headers)).toBe("203.0.113.195");
  });

  it("accepts valid IPv6 from x-real-ip", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "2001:db8:85a3:8d3:1319:8a2e:370:7348");
    expect(getClientIp(headers)).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348");
  });

  // ── Local dev / Docker path (nginx sets x-forwarded-for) ─────────────────

  it("falls back to x-forwarded-for first entry when x-real-ip is absent (local dev / Docker)", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "203.0.113.195, 70.41.3.18, 150.172.238.178");
    // No x-real-ip → fall back to first XFF entry (nginx sets $remote_addr here)
    expect(getClientIp(headers)).toBe("203.0.113.195");
  });

  it("extracts valid IPv6 from x-forwarded-for when x-real-ip is absent", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "2001:db8:85a3:8d3:1319:8a2e:370:7348");
    expect(getClientIp(headers)).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348");
  });

  it("falls back to 127.0.0.1 when x-real-ip is invalid and x-forwarded-for is missing", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "not-an-ip");
    expect(getClientIp(headers)).toBe("127.0.0.1");
  });

  it("falls back to 127.0.0.1 when both headers are missing", () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe("127.0.0.1");
  });

  it("falls back to x-forwarded-for when x-real-ip is invalid", () => {
    const headers = new Headers();
    headers.set("x-real-ip", "not-a-valid-ip");
    headers.set("x-forwarded-for", "198.51.100.1");
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });
});

