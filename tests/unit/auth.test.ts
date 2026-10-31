import { describe, it, expect, vi, beforeEach } from "vitest";
import { requireUser, authService } from "@/lib/auth";
import type { Session } from "next-auth";

describe("auth helper (requireUser)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 401 response when user session is not found", async () => {
    vi.spyOn(authService, "auth").mockResolvedValue(null);

    const result = await requireUser();
    expect(result.user).toBeNull();
    expect(result.errorResponse).not.toBeNull();
    expect(result.errorResponse?.status).toBe(401);

    const body = await result.errorResponse!.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns user object and null errorResponse when user session exists", async () => {
    const mockSession: Session = {
      user: {
        id: "usr_123",
        email: "student@example.com",
        name: "Test Student",
      },
      expires: "2099-01-01",
    };
    vi.spyOn(authService, "auth").mockResolvedValue(mockSession);

    const result = await requireUser();
    expect(result.errorResponse).toBeNull();
    expect(result.user).toEqual({
      id: "usr_123",
      email: "student@example.com",
      name: "Test Student",
    });
  });
});
