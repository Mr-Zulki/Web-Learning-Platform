import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonWorkspace } from "@/components/editor/LessonWorkspace";

// Mock the dynamically loaded CodeEditor with a simple textarea
vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: ({
    value,
    onChange,
    ariaLabel,
  }: {
    value: string;
    onChange: (val: string) => void;
    ariaLabel: string;
  }) => (
    <textarea
      data-testid="mock-code-editor"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("LessonWorkspace", () => {
  const starterCode = {
    html: "<h1>Starter</h1>",
    css: "h1 { color: green; }",
  };
  const lessonId = "test-lesson";

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("loads and displays starter code by default", async () => {
    render(
      <LessonWorkspace lessonId={lessonId} starterCode={starterCode}>
        <div>Lesson Body</div>
      </LessonWorkspace>
    );

    const textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);
  });

  it("switches tabs between HTML and CSS", async () => {
    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);

    const textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);

    const cssTab = screen.getByRole("tab", { name: /CSS/i });
    fireEvent.click(cssTab);

    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.css);
  });

  it("typing updates state and persists draft into localStorage", async () => {
    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);

    const textarea = await screen.findByTestId("mock-code-editor");
    fireEvent.change(textarea, { target: { value: "<h1>Modified HTML</h1>" } });

    expect((textarea as HTMLTextAreaElement).value).toBe(
      "<h1>Modified HTML</h1>"
    );

    const savedRaw = localStorage.getItem(`uni:draft:${lessonId}`);
    expect(savedRaw).not.toBeNull();
    const saved = JSON.parse(savedRaw!);
    expect(saved.html).toBe("<h1>Modified HTML</h1>");
    expect(saved.css).toBe(starterCode.css);
  });

  it("reset restores starter code and removes the saved draft", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);

    const textarea = await screen.findByTestId("mock-code-editor");
    fireEvent.change(textarea, { target: { value: "<h1>Changed</h1>" } });

    expect((textarea as HTMLTextAreaElement).value).toBe("<h1>Changed</h1>");

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetButton);

    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);
    expect(localStorage.getItem(`uni:draft:${lessonId}`)).toBeNull();
  });

  it("loads saved draft from localStorage on mount", async () => {
    localStorage.setItem(
      `uni:draft:${lessonId}`,
      JSON.stringify({
        html: "<h2>Persisted Draft</h2>",
        css: "h2 { color: purple; }",
      })
    );

    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);

    const textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(
      "<h2>Persisted Draft</h2>"
    );
  });

  it("ignores corrupted or invalid drafts in localStorage and uses starter code", async () => {
    // 1. Invalid JSON
    localStorage.setItem(`uni:draft:${lessonId}`, "not-valid-json{");
    const { unmount } = render(
      <LessonWorkspace lessonId={lessonId} starterCode={starterCode} />
    );
    let textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);
    unmount();

    // 2. Missing properties or wrong types
    localStorage.setItem(
      `uni:draft:${lessonId}`,
      JSON.stringify({ html: 12345, css: null })
    );
    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);
    textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);
  });

  it("does not crash when localStorage throws an exception", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("AccessDenied");
    });

    render(<LessonWorkspace lessonId={lessonId} starterCode={starterCode} />);

    const textarea = await screen.findByTestId("mock-code-editor");
    expect((textarea as HTMLTextAreaElement).value).toBe(starterCode.html);

    // Typing should not crash despite setItem failure
    expect(() => {
      fireEvent.change(textarea, { target: { value: "<p>Safe</p>" } });
    }).not.toThrow();
  });
});
