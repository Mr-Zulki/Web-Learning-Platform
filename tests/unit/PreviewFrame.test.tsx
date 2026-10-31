import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PreviewFrame } from "@/components/editor/PreviewFrame";

describe("PreviewFrame", () => {
  it("renders an iframe with sandbox='allow-scripts' exactly and strictly forbids allow-same-origin", () => {
    const { container } = render(
      <PreviewFrame html="<h1>Title</h1>" css="h1 { color: blue; }" />
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute("sandbox", "allow-scripts");

    const sandboxValue = iframe?.getAttribute("sandbox") || "";
    expect(sandboxValue).toBe("allow-scripts");
    expect(sandboxValue).not.toContain("allow-same-origin");
    expect(sandboxValue).not.toContain("allow-top-navigation");
    expect(sandboxValue).not.toContain("allow-forms");
    expect(sandboxValue).not.toContain("allow-popups");
    expect(sandboxValue).not.toContain("allow-modals");
  });

  it("sets correct referrerPolicy, title, and loading attributes", () => {
    const { container } = render(
      <PreviewFrame html="<p>Test</p>" css="p { color: red; }" />
    );

    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("referrerPolicy", "no-referrer");
    expect(iframe).toHaveAttribute("title", "Live preview");
    expect(iframe).toHaveAttribute("loading", "lazy");
  });

  it("injects user CSS into srcDoc", () => {
    const userCss = ".custom-class { font-weight: bold; }";
    const { container } = render(
      <PreviewFrame html="<div>Hello</div>" css={userCss} />
    );

    const iframe = container.querySelector("iframe");
    const srcDoc = iframe?.getAttribute("srcdoc") || "";
    expect(srcDoc).toContain(userCss);
    expect(srcDoc).toContain("<div>Hello</div>");
  });
});
