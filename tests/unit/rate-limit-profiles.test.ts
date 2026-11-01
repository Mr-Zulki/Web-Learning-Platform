import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getActiveRateLimitProfile,
  getRateLimitProfileConfig,
  getRegisterLimitConfig,
  getLoginLimitConfig,
  getProgressLimitConfig,
  RATE_LIMIT_CONFIGS,
} from "@/lib/rate-limit-config";

describe("Rate Limit Profiles Configuration", () => {
  const originalEnv = process.env.RATE_LIMIT_PROFILE;

  beforeEach(() => {
    delete process.env.RATE_LIMIT_PROFILE;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.RATE_LIMIT_PROFILE = originalEnv;
    } else {
      delete process.env.RATE_LIMIT_PROFILE;
    }
  });

  it("defaults to strict profile when env var is not set", () => {
    expect(getActiveRateLimitProfile()).toBe("strict");
    const cfg = getRateLimitProfileConfig();
    expect(cfg).toEqual(RATE_LIMIT_CONFIGS.strict);
    expect(cfg.register.limit).toBe(5);
    expect(cfg.loginIp.limit).toBe(10);
    expect(cfg.progress.limit).toBe(60);
  });

  it("activates demo profile when RATE_LIMIT_PROFILE=demo", () => {
    process.env.RATE_LIMIT_PROFILE = "demo";
    expect(getActiveRateLimitProfile()).toBe("demo");

    const cfg = getRateLimitProfileConfig();
    expect(cfg).toEqual(RATE_LIMIT_CONFIGS.demo);
    expect(cfg.register.limit).toBe(1000);
    expect(cfg.loginIp.limit).toBe(3000);
    expect(cfg.progress.limit).toBe(600);
  });

  it("case-insensitively parses RATE_LIMIT_PROFILE", () => {
    process.env.RATE_LIMIT_PROFILE = "DEMO";
    expect(getActiveRateLimitProfile()).toBe("demo");

    process.env.RATE_LIMIT_PROFILE = "  DeMo  ";
    expect(getActiveRateLimitProfile()).toBe("demo");
  });

  it("falls back to strict on unrecognized profile value", () => {
    process.env.RATE_LIMIT_PROFILE = "custom_unknown";
    expect(getActiveRateLimitProfile()).toBe("strict");
  });

  it("returns helper functions aligned with active profile", () => {
    process.env.RATE_LIMIT_PROFILE = "demo";
    expect(getRegisterLimitConfig().limit).toBe(1000);
    expect(getLoginLimitConfig().ip.limit).toBe(3000);
    expect(getLoginLimitConfig().email.limit).toBe(3000);
    expect(getProgressLimitConfig().limit).toBe(600);
  });
});
