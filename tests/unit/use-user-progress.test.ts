import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useUserProgress } from "@/lib/use-user-progress";
import * as nextAuthReact from "next-auth/react";

describe("useUserProgress hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty sets and null summary when unauthenticated", () => {
    vi.spyOn(nextAuthReact, "useSession").mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: vi.fn(),
    });

    const { result } = renderHook(() => useUserProgress());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.completedLessonIds.size).toBe(0);
    expect(result.current.startedLessonIds.size).toBe(0);
    expect(result.current.summary).toBeNull();
  });

  it("fetches progress and populates completed and started sets when authenticated", async () => {
    vi.spyOn(nextAuthReact, "useSession").mockReturnValue({
      data: {
        user: {
          id: "u1",
          email: "student@example.com",
          name: "Student",
        },
        expires: "2099-01-01",
      },
      status: "authenticated",
      update: vi.fn(),
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        progress: [
          { lessonId: "html-structure", status: "COMPLETED" },
          { lessonId: "text-tags", status: "STARTED" },
        ],
        summary: { completed: 1, total: 5 },
      }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useUserProgress());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.completedLessonIds.has("html-structure")).toBe(
        true
      );
      expect(result.current.startedLessonIds.has("text-tags")).toBe(true);
      expect(result.current.summary).toEqual({ completed: 1, total: 5 });
    });
  });
});
