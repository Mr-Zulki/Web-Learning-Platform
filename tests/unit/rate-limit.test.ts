import { describe, it, expect } from "vitest";
import { getClientIp } from "@/lib/rate-limit";

describe("rate-limit client IP extraction", () => {
  it("extracts valid IPv4 from x-forwarded-for first entry", () => {
    const headers = new Headers();
    headers.set(
      "x-forwarded-for",
      "203.0.113.195, 70.41.3.18, 150.172.238.178"
    );
    expect(getClientIp(headers)).toBe("203.0.113.195");
  });

  it("extracts valid IPv6 from x-forwarded-for", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "2001:db8:85a3:8d3:1319:8a2e:370:7348");
    expect(getClientIp(headers)).toBe("2001:db8:85a3:8d3:1319:8a2e:370:7348");
  });

  it("falls back to x-real-ip when x-forwarded-for is missing or invalid", () => {
    const headers = new Headers();
    headers.set("x-forwarded-for", "not-a-valid-ip");
    headers.set("x-real-ip", "198.51.100.1");
    expect(getClientIp(headers)).toBe("198.51.100.1");
  });

  it("falls back to 127.0.0.1 when all headers are missing or invalid", () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe("127.0.0.1");
  });
});
