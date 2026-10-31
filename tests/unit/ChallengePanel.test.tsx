import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChallengePanel } from "@/components/challenge/ChallengePanel";
import type { ClientChallenge } from "@/lib/challenges";

describe("ChallengePanel Component", () => {
  const mockChallenge: ClientChallenge = {
    id: "challenge-test",
    lessonId: "test-lesson",
    title: "Test Challenge Title",
    task: "Complete this **important** test task.",
    hints: ["First hint text", "Second hint text"],
    rules: [
      {
        type: "element-exists",
        selector: "h1",
        min: 1,
        message: "Must include an <h1> tag",
      },
      {
        type: "element-exists",
        selector: "p",
        min: 1,
        message: "Must include a <p> tag",
      },
    ],
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders task description and check code button", () => {
    render(
      <ChallengePanel
        challenge={mockChallenge}
        html="<div></div>"
        css=""
        nextLesson={{ id: "next-lesson", title: "Next Lesson" }}
      />
    );

    expect(screen.getByText("Test Challenge Title")).toBeInTheDocument();
    expect(screen.getByText(/Complete this/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Check my code/i })
    ).toBeInTheDocument();
  });

  it("reveals hints one at a time and cannot skip", () => {
    render(<ChallengePanel challenge={mockChallenge} html="" css="" />);

    expect(screen.queryByText("First hint text")).not.toBeInTheDocument();
    expect(screen.queryByText("Second hint text")).not.toBeInTheDocument();

    const hintBtn = screen.getByRole("button", { name: /Show hint 1/i });
    fireEvent.click(hintBtn);

    expect(screen.getByText(/First hint text/i)).toBeInTheDocument();
    expect(screen.queryByText(/Second hint text/i)).not.toBeInTheDocument();

    const nextHintBtn = screen.getByRole("button", { name: /Show hint 2/i });
    fireEvent.click(nextHintBtn);

    expect(screen.getByText(/First hint text/i)).toBeInTheDocument();
    expect(screen.getByText(/Second hint text/i)).toBeInTheDocument();

    // All hints unlocked
    expect(
      screen.queryByRole("button", { name: /Show hint/i })
    ).not.toBeInTheDocument();
  });

  it("runs checks, renders aria-live region and failure results", () => {
    render(
      <ChallengePanel
        challenge={mockChallenge}
        html="<h1>Only heading</h1>"
        css=""
      />
    );

    const checkBtn = screen.getByRole("button", { name: /Check my code/i });
    fireEvent.click(checkBtn);

    // Results container with aria-live="polite"
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();

    expect(screen.getByText(/1 of 2 checks passed/i)).toBeInTheDocument();
    expect(screen.getByText(/Must include a <p> tag/i)).toBeInTheDocument();
  });

  it("shows success state and link to next lesson when all checks pass", () => {
    render(
      <ChallengePanel
        challenge={mockChallenge}
        html="<h1>Title</h1><p>Paragraph</p>"
        css=""
        nextLesson={{ id: "css-basics", title: "CSS Basics" }}
      />
    );

    const checkBtn = screen.getByRole("button", { name: /Check my code/i });
    fireEvent.click(checkBtn);

    expect(screen.getByText(/2 of 2 checks passed/i)).toBeInTheDocument();
    expect(screen.getByText(/All checks passed!/i)).toBeInTheDocument();
    expect(screen.getByText(/🎉 Great job!/i)).toBeInTheDocument();

    const nextLink = screen.getByRole("link", {
      name: /Continue to next lesson: CSS Basics →/i,
    });
    expect(nextLink).toHaveAttribute("href", "/lessons/css-basics");
  });

  it("omits next lesson link on the last lesson", () => {
    render(
      <ChallengePanel
        challenge={mockChallenge}
        html="<h1>Title</h1><p>Paragraph</p>"
        css=""
        nextLesson={null}
      />
    );

    const checkBtn = screen.getByRole("button", { name: /Check my code/i });
    fireEvent.click(checkBtn);

    expect(screen.getByText(/All checks passed!/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Continue to next lesson/i })
    ).not.toBeInTheDocument();
  });
});
