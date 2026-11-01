export type RateLimitProfile = "strict" | "demo";

export interface RateLimitRule {
  limit: number;
  windowSeconds: number;
}

export interface ProfileLimits {
  register: RateLimitRule;
  loginIp: RateLimitRule;
  loginEmail: RateLimitRule;
  progress: RateLimitRule;
}

export const RATE_LIMIT_CONFIGS: Record<RateLimitProfile, ProfileLimits> = {
  strict: {
    register: { limit: 5, windowSeconds: 3600 }, // 5/hr/IP
    loginIp: { limit: 10, windowSeconds: 900 }, // 10/15min/IP
    loginEmail: { limit: 10, windowSeconds: 900 }, // 10/15min/email
    progress: { limit: 60, windowSeconds: 60 }, // 60/min/user
  },
  demo: {
    register: { limit: 1000, windowSeconds: 3600 }, // 1000/hr/IP for single-IP load test
    loginIp: { limit: 3000, windowSeconds: 900 }, // 3000/15min/IP
    loginEmail: { limit: 3000, windowSeconds: 900 }, // 3000/15min/email
    progress: { limit: 600, windowSeconds: 60 }, // 600/min/user
  },
};

/**
 * Returns the active rate limiting profile name ("strict" | "demo").
 * Defaults to "strict" unless RATE_LIMIT_PROFILE=demo is explicitly set.
 */
export function getActiveRateLimitProfile(): RateLimitProfile {
  const envProfile = (process.env.RATE_LIMIT_PROFILE || "")
    .trim()
    .toLowerCase();
  return envProfile === "demo" ? "demo" : "strict";
}

/**
 * Returns the configuration for the active or requested profile.
 */
export function getRateLimitProfileConfig(
  profile?: RateLimitProfile
): ProfileLimits {
  const selected = profile || getActiveRateLimitProfile();
  return RATE_LIMIT_CONFIGS[selected] || RATE_LIMIT_CONFIGS.strict;
}

export function getRegisterLimitConfig(): RateLimitRule {
  return getRateLimitProfileConfig().register;
}

export function getLoginLimitConfig(): {
  ip: RateLimitRule;
  email: RateLimitRule;
} {
  const cfg = getRateLimitProfileConfig();
  return { ip: cfg.loginIp, email: cfg.loginEmail };
}

export function getProgressLimitConfig(): RateLimitRule {
  return getRateLimitProfileConfig().progress;
}
