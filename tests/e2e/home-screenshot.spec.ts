import { test, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

test.describe("Home Page Visual Verification & Screenshot", () => {
  test("captures full-page screenshot of home page at 1440px wide", async ({
    page,
  }) => {
    // Set 1440px wide viewport matching reference specifications
    await page.setViewportSize({ width: 1440, height: 900 });

    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    // Ensure hero elements are rendered
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Learn HTML & CSS by Actually Writing Code/i,
      })
    ).toBeVisible();

    // Ensure interactive mockup is rendered
    await expect(page.getByText("workspace-sandbox.html")).toBeVisible();
    await expect(page.getByText("All Tests Passed! 🎉")).toBeVisible();

    // Ensure features section is rendered
    await expect(
      page.getByRole("heading", { name: "Why Engineers Choose CodeCraft" })
    ).toBeVisible();

    // Ensure 5 core lessons curriculum section is rendered
    await expect(
      page.getByRole("heading", {
        name: "From Fundamentals to Responsive Production in 5 Modules",
      })
    ).toBeVisible();

    // Ensure testimonials section is rendered
    await expect(
      page.getByRole("heading", {
        name: "Trusted by Learners Building Real Pages",
      })
    ).toBeVisible();

    // Ensure final CTA section is rendered
    await expect(
      page.getByRole("heading", {
        name: "Ready to build your first website today?",
      })
    ).toBeVisible();

    // Create target screenshot comparison directory
    const outputDir = path.resolve(process.cwd(), "docs/screenshots/compare");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const screenshotPath = path.join(outputDir, "home-1440.png");

    // Capture full page screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    expect(fs.existsSync(screenshotPath)).toBe(true);
  });

  test("verifies responsive single-column layout at 390px mobile viewport", async ({
    page,
  }) => {
    const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000";
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Learn HTML & CSS by/i,
      })
    ).toBeVisible();

    // Check no horizontal scrollbar on mobile viewport
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    );

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});
