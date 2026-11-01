import { test, expect } from "@playwright/test";

test.describe("Interactive Workspace and Mobile Tab Switching", () => {
  test("renders 3-pane resizable layout on desktop and captures screenshots", async ({
    page,
  }) => {
    // 1440px desktop viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // Visit home page and screenshot
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "HTML/CSS Interactive Learning Platform",
      })
    ).toBeVisible();
    await page.screenshot({
      path: "docs/screenshots/desktop-home.png",
      fullPage: true,
    });

    // Visit lesson page
    await page.goto("/lessons/html-structure");
    await expect(
      page.getByRole("heading", { level: 1, name: "HTML Structure" })
    ).toBeVisible();

    // Verify 3-pane elements
    const checkBtn = page.getByRole("button", { name: "Check my code" });
    await expect(checkBtn).toBeVisible();
    await expect(page.locator(".cm-content").first()).toBeVisible();
    await expect(page.locator('iframe[title="Live preview"]')).toBeVisible();

    // Verify tests checklist initial state
    await expect(page.getByText("Test Checklist")).toBeVisible();
    await expect(
      page.getByText("Must include an <h1> tag inside the <body>")
    ).toBeVisible();

    // Screenshot initial desktop workspace
    await page.screenshot({
      path: "docs/screenshots/desktop-lesson.png",
      fullPage: false,
    });

    // Run check on starter code (should fail some checks)
    await checkBtn.click();
    await expect(page.getByText(/checks passed/i)).toBeVisible();

    // Inject good solution
    const solutionHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Profile Page</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
  </body>
</html>`;
    const codeMirrorContent = page.locator(".cm-content").first();
    await codeMirrorContent.click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.insertText(solutionHtml);

    // Re-check
    await checkBtn.click();
    await expect(page.getByText("All checks passed!")).toBeVisible();
    await expect(
      page.getByText("🎉 Great job! You successfully completed this challenge.")
    ).toBeVisible();
  });

  test("supports mobile tab switching down to 390px without horizontal overflow", async ({
    page,
  }) => {
    // 390px mobile viewport (iPhone 12/13/14 size)
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/lessons/html-structure");
    await expect(
      page.getByRole("heading", { level: 1, name: "HTML Structure" })
    ).toBeVisible();

    // Workspace tablist exists
    const tablist = page.getByRole("tablist", {
      name: "Lesson workspace navigation",
    });
    await expect(tablist).toBeVisible();

    // Switch to Editor tab
    const editorTab = page.getByRole("tab", { name: "Editor" });
    await editorTab.click();
    await expect(page.locator(".cm-content").first()).toBeVisible();
    await page.screenshot({
      path: "docs/screenshots/mobile-lesson-editor.png",
    });

    // Switch to Preview tab
    const previewTab = page.getByRole("tab", { name: "Preview" });
    await previewTab.click();
    await expect(page.locator('iframe[title="Live preview"]')).toBeVisible();
    await page.screenshot({
      path: "docs/screenshots/mobile-lesson-preview.png",
    });

    // Switch to Challenge tab
    const challengeTab = page.getByRole("tab", { name: "Challenge" });
    await challengeTab.click();
    await expect(
      page.getByRole("button", { name: "Check my code" })
    ).toBeVisible();

    // Verify no horizontal overflow on mobile
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});

