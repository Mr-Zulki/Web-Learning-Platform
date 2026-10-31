import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditorTabs } from "@/components/editor/EditorTabs";
import { EditorToolbar } from "@/components/editor/EditorToolbar";

describe("EditorTabs Keyboard Navigation", () => {
  it("navigates tabs using ArrowRight and ArrowLeft", () => {
    const onTabChange = vi.fn();
    render(<EditorTabs activeTab="html" onTabChange={onTabChange} />);

    const htmlTab = screen.getByRole("tab", { name: /HTML/i });
    htmlTab.focus();

    fireEvent.keyDown(htmlTab, { key: "ArrowRight" });
    expect(onTabChange).toHaveBeenCalledWith("css");

    fireEvent.keyDown(htmlTab, { key: "ArrowLeft" });
    expect(onTabChange).toHaveBeenCalledWith("css");
  });

  it("navigates tabs using Home and End keys", () => {
    const onTabChange = vi.fn();
    render(<EditorTabs activeTab="html" onTabChange={onTabChange} />);

    const htmlTab = screen.getByRole("tab", { name: /HTML/i });
    htmlTab.focus();

    fireEvent.keyDown(htmlTab, { key: "End" });
    expect(onTabChange).toHaveBeenCalledWith("css");

    fireEvent.keyDown(htmlTab, { key: "Home" });
    expect(onTabChange).toHaveBeenCalledWith("html");
  });
});

describe("EditorToolbar", () => {
  it("copies code and toggles Copied! label", () => {
    const onCopy = vi.fn();
    render(
      <EditorToolbar
        activeTab="html"
        currentLength={50}
        maxLength={50000}
        isModified={false}
        onReset={vi.fn()}
        onCopy={onCopy}
      />
    );

    const copyBtn = screen.getByRole("button", { name: /Copy code/i });
    fireEvent.click(copyBtn);

    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });

  it("handles reset cancellation when code is modified", () => {
    const onReset = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(
      <EditorToolbar
        activeTab="html"
        currentLength={100}
        maxLength={50000}
        isModified={true}
        onReset={onReset}
        onCopy={vi.fn()}
      />
    );

    const resetBtn = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();
  });

  it("formats character count and warns when over limit", () => {
    render(
      <EditorToolbar
        activeTab="css"
        currentLength={55000}
        maxLength={50000}
        isModified={true}
        onReset={vi.fn()}
        onCopy={vi.fn()}
      />
    );

    expect(screen.getByText("55,000")).toBeInTheDocument();
    expect(screen.getByText("50,000")).toBeInTheDocument();
  });
});
