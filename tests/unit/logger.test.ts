import { describe, it, expect } from "vitest";
import { redactSensitive } from "@/lib/logger";

describe("structured logger redaction", () => {
  it("redacts sensitive fields in shallow objects", () => {
    const input = {
      username: "student1",
      password: "SuperSecretPassword!",
      passwordHash: "$2b$12$somehashhere",
      token: "secret-token-xyz",
      authorization: "Bearer abc.def.ghi",
    };

    const redacted = redactSensitive(input) as Record<string, string>;

    expect(redacted.username).toBe("student1");
    expect(redacted.password).toBe("[REDACTED]");
    expect(redacted.passwordHash).toBe("[REDACTED]");
    expect(redacted.token).toBe("[REDACTED]");
    expect(redacted.authorization).toBe("[REDACTED]");
  });

  it("redacts sensitive fields in deeply nested structures and arrays", () => {
    const input = {
      meta: {
        request: {
          headers: {
            Authorization: "Bearer token123",
            Cookie: "session=secretcookie",
          },
        },
      },
      users: [
        { email: "user@example.com", password: "p1" },
        { email: "admin@example.com", password: "p2" },
      ],
    };

    const redacted = redactSensitive(input) as typeof input;

    expect(redacted.meta.request.headers.Authorization).toBe("[REDACTED]");
    expect(redacted.meta.request.headers.Cookie).toBe("[REDACTED]");
    expect(redacted.users[0]?.password).toBe("[REDACTED]");
    expect(redacted.users[1]?.password).toBe("[REDACTED]");
    expect(redacted.users[0]?.email).toBe("user@example.com");
  });

  it("handles null, undefined, and primitive types safely", () => {
    expect(redactSensitive(null)).toBeNull();
    expect(redactSensitive(undefined)).toBeUndefined();
    expect(redactSensitive("plain string")).toBe("plain string");
    expect(redactSensitive(12345)).toBe(12345);
  });
});
