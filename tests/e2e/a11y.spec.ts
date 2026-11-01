import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility (WCAG 2.1 AA) Audit", () => {
  const routes = [
    { name: "Home", path: "/" },
    { name: "Lessons Catalog", path: "/lessons" },
    { name: "Lesson Workspace", path: "/lessons/html-structure" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  for (const route of routes) {
    test(`verifies ${route.name} (${route.path}) satisfies WCAG 2.1 AA in Dark Mode`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await page.waitForLoadState("domcontentloaded");

      // Analyze page accessibility (excluding iframe which runs untrusted user code in isolated sandbox)
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("iframe")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`verifies ${route.name} (${route.path}) satisfies WCAG 2.1 AA in Light Mode`, async ({
      page,
    }) => {
      await page.goto(route.path);
      await page.waitForLoadState("domcontentloaded");

      // Switch to light mode
      await page.evaluate(() => {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("iframe")
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});

