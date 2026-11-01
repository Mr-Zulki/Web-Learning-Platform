import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E Configuration (Phase 6 Lean Safety Net)
 * Targets the running Docker stack (http://localhost:8080) by default,
 * or boots Next.js dev server if no server is running.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // Sequential execution to prevent test collision
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:8080",
    trace: "on-first-retry",
    video: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_START_DEV
    ? {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        timeout: 120 * 1000,
      }
    : undefined,
});
