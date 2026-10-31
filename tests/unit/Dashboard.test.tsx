import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { authService } from "@/lib/auth";
import { db } from "@/lib/db";
import * as navigationModule from "next/navigation";
import type { Session } from "next-auth";
import type { Progress } from "@prisma/client";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Dashboard Page Component Test", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects to /login?next=/dashboard when unauthenticated", async () => {
    vi.spyOn(authService, "auth").mockResolvedValue(null);

    await DashboardPage();

    expect(navigationModule.redirect).toHaveBeenCalledWith(
      "/login?next=/dashboard"
    );
  });

  it("renders progress bar, percentage, and lesson status badges when authenticated", async () => {
    const mockSession: Session = {
      user: {
        id: "usr_1",
        email: "student@example.com",
        name: "Alice",
      },
      expires: "2099-01-01",
    };
    vi.spyOn(authService, "auth").mockResolvedValue(mockSession);

    const mockRecords: Progress[] = [
      {
        id: "p1",
        userId: "usr_1",
        lessonId: "html-structure",
        challengeId: "challenge-html-structure",
        status: "COMPLETED",
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "p2",
        userId: "usr_1",
        lessonId: "text-tags",
        challengeId: "challenge-text-tags",
        status: "STARTED",
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    vi.spyOn(db.progress, "findMany").mockResolvedValue(mockRecords);

    const jsx = await DashboardPage();
    render(jsx);

    expect(screen.getByText(/learner dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText(/1 of 5 completed/i)).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });
});
