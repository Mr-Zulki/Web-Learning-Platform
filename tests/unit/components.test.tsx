import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LessonCard } from "@/components/LessonCard";
import { LessonPager } from "@/components/LessonPager";
import type { Lesson } from "@/lib/lesson-schema";

describe("Component Unit Tests", () => {
  const sampleLesson1: Lesson = {
    id: "html-structure",
    title: "HTML Structure",
    order: 1,
    summary: "Document skeleton fundamentals.",
    body: "# Content",
    starterCode: { html: "", css: "" },
    challengeId: "challenge-html-structure",
  };

  const sampleLesson2: Lesson = {
    id: "text-tags",
    title: "Text Tags",
    order: 2,
    summary: "Headings and paragraphs.",
    body: "# Content",
    starterCode: { html: "", css: "" },
    challengeId: "challenge-text-tags",
  };

  describe("LessonCard", () => {
    it("renders title, summary, and link to lesson detail", () => {
      render(<LessonCard lesson={sampleLesson1} />);

      const titleHeading = screen.getByRole("heading", {
        name: /HTML Structure/i,
      });
      expect(titleHeading).toBeInTheDocument();

      const summaryText = screen.getByText("Document skeleton fundamentals.");
      expect(summaryText).toBeInTheDocument();

      const links = screen.getAllByRole("link");
      expect(links.length).toBeGreaterThanOrEqual(1);
      expect(links[0]).toHaveAttribute("href", "/lessons/html-structure");
    });
  });

  describe("LessonPager", () => {
    it("hides prev on first lesson and shows next", () => {
      render(<LessonPager prev={null} next={sampleLesson2} />);

      expect(screen.queryByText(/Previous:/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Next:/i)).toBeInTheDocument();
      expect(screen.getByText("Text Tags")).toBeInTheDocument();

      const nextLink = screen.getByRole("link", { name: /Next:/i });
      expect(nextLink).toHaveAttribute("href", "/lessons/text-tags");
    });

    it("hides next on last lesson and shows prev", () => {
      render(<LessonPager prev={sampleLesson1} next={null} />);

      expect(screen.getByText(/Previous:/i)).toBeInTheDocument();
      expect(screen.getByText("HTML Structure")).toBeInTheDocument();
      expect(screen.queryByText(/Next:/i)).not.toBeInTheDocument();

      const prevLink = screen.getByRole("link", { name: /Previous:/i });
      expect(prevLink).toHaveAttribute("href", "/lessons/html-structure");
    });

    it("renders both prev and next for middle lessons", () => {
      render(<LessonPager prev={sampleLesson1} next={sampleLesson2} />);

      expect(screen.getByText(/Previous:/i)).toBeInTheDocument();
      expect(screen.getByText(/Next:/i)).toBeInTheDocument();
    });
  });
});
