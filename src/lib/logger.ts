const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "authorization",
  "cookie",
  "secret",
  "auth_secret",
]);

export function redactSensitive(val: unknown): unknown {
  if (val === null || val === undefined) {
    return val;
  }

  if (typeof val !== "object") {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map((item) => redactSensitive(item));
  }

  const result: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(val as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      result[key] = "[REDACTED]";
    } else if (typeof v === "object" && v !== null) {
      result[key] = redactSensitive(v);
    } else {
      result[key] = v;
    }
  }

  return result;
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    const payload = meta ? ` ${JSON.stringify(redactSensitive(meta))}` : "";
    console.info(`[INFO] ${message}${payload}`);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    const payload = meta ? ` ${JSON.stringify(redactSensitive(meta))}` : "";
    console.warn(`[WARN] ${message}${payload}`);
  },
  error(message: string, meta?: Record<string, unknown>) {
    const payload = meta ? ` ${JSON.stringify(redactSensitive(meta))}` : "";
    console.error(`[ERROR] ${message}${payload}`);
  },
  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== "production") {
      const payload = meta ? ` ${JSON.stringify(redactSensitive(meta))}` : "";
      console.debug(`[DEBUG] ${message}${payload}`);
    }
  },
};
