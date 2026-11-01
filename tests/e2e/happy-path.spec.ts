import { test, expect } from "@playwright/test";

test.describe("Happy Path E2E Learning Journey", () => {
  const timestamp = Date.now();
  const testUser = {
    name: "Happy Tester",
    email: `e2e_user_${timestamp}@example.com`,
    password: "Password123!",
  };

  test("completes registration, login, challenge submission, and dashboard progress reflection", async ({
    page,
  }) => {
    // 1. Visit registration page
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { name: "Create an Account" })
    ).toBeVisible();

    // 2. Fill registration form and submit
    await page.locator("#register-name").fill(testUser.name);
    await page.locator("#register-email").fill(testUser.email);
    await page.locator("#register-password").fill(testUser.password);
    await page.locator('button[type="submit"]').click();

    // 3. Confirm redirected to dashboard or login
    await page.waitForURL(
      (url) => {
        const p = url.pathname;
        return p === "/dashboard" || p === "/login";
      },
      { timeout: 15000 }
    );

    // If redirected to login (e.g. if auto-sign in fallback triggered), log in manually
    if (page.url().includes("/login")) {
      await page.locator("#login-email").fill(testUser.email);
      await page.locator("#login-password").fill(testUser.password);
      await page.locator('button[type="submit"]').click();
      await page.waitForURL("**/dashboard", { timeout: 15000 });
    }

    await expect(
      page.getByRole("heading", { name: "Learner Dashboard" })
    ).toBeVisible({ timeout: 15000 });

    // 4. Open the first lesson: HTML Structure
    await page.goto("/lessons/html-structure");
    await expect(
      page.getByRole("heading", { level: 1, name: "HTML Structure" })
    ).toBeVisible({ timeout: 15000 });

    // Ensure challenge panel is visible
    const checkBtn = page.getByRole("button", { name: "Check my code" });
    await expect(checkBtn).toBeVisible({ timeout: 10000 });

    // 5. Inject the known-good solution for challenge-html-structure
    const solutionHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My Profile Page</title>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
  </body>
</html>`;

    // Type or insert solution into CodeMirror editor
    const codeMirrorContent = page.locator(".cm-content");
    await expect(codeMirrorContent.first()).toBeVisible();
    await codeMirrorContent.first().click();

    // Select all and replace with solution
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Backspace");
    await page.keyboard.insertText(solutionHtml);

    // 6. Submit the challenge
    await checkBtn.click();

    // 7. Assert success state
    await expect(page.locator("text=All checks passed!")).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator("text=✓ Progress saved")).toBeVisible({
      timeout: 10000,
    });

    // 8. Verify progress reflected on the dashboard
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Learner Dashboard" })
    ).toBeVisible({ timeout: 15000 });

    // Overall progress should show at least 1 completed
    await expect(page.locator("text=1 of 5 completed")).toBeVisible({
      timeout: 10000,
    });

    // HTML Structure lesson should show "Completed" badge
    await expect(
      page.locator("span", { hasText: "Completed" }).first()
    ).toBeVisible();
  });
});
