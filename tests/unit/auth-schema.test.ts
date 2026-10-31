import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "@/lib/auth-schema";

describe("auth-schema", () => {
  describe("registerSchema", () => {
    it("accepts valid registration data and normalizes email", () => {
      const input = {
        name: "  Jane Doe  ",
        email: "  Jane.Doe@Example.COM  ",
        password: "securePassword123",
      };

      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("jane.doe@example.com");
        expect(result.data.name).toBe("Jane Doe");
      }
    });

    it("rejects password shorter than 8 characters", () => {
      const input = {
        name: "Jane",
        email: "jane@example.com",
        password: "short",
      };

      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain(
          "at least 8 characters"
        );
      }
    });

    it("rejects password exceeding 72 bytes (bcrypt truncation limit)", () => {
      const input = {
        name: "Jane",
        email: "jane@example.com",
        password: "a".repeat(73),
      };

      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("72 bytes");
      }
    });

    it("rejects password identical to email", () => {
      const input = {
        name: "Jane",
        email: "student@example.com",
        password: "student@example.com",
      };

      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain("same as your email");
      }
    });

    it("rejects invalid email address and empty name", () => {
      const input = {
        name: "   ",
        email: "not-an-email",
        password: "validPassword123",
      };

      const result = registerSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("loginSchema", () => {
    it("accepts valid login data and normalizes email", () => {
      const input = {
        email: "  USER@Example.COM ",
        password: "mypassword",
      };

      const result = loginSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
        expect(result.data.password).toBe("mypassword");
      }
    });

    it("rejects empty password or invalid email", () => {
      expect(
        loginSchema.safeParse({ email: "invalid", password: "pwd" }).success
      ).toBe(false);
      expect(
        loginSchema.safeParse({ email: "test@example.com", password: "" })
          .success
      ).toBe(false);
    });
  });
});
