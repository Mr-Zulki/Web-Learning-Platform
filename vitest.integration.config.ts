import { defineConfig } from "vitest/config";
import path from "node:path";

process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgresql://postgres:postgres_dev_password@127.0.0.1:5432/uni_test?schema=public";
process.env.AUTH_SECRET =
  process.env.AUTH_SECRET || "test-super-secret-key-at-least-32-chars-long";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/integration/**/*.test.ts"],
    testTimeout: 20000,
    hookTimeout: 20000,
    // Run integration test FILES sequentially — they share a real DB and
    // phase4.test.ts's beforeEach deletes all users, which breaks parallel files.
    fileParallelism: false,
    server: {
      deps: {
        inline: ["next-auth"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/server": path.resolve(__dirname, "./node_modules/next/server.js"),
      "server-only": path.resolve(
        __dirname,
        "./node_modules/server-only/empty.js"
      ),
    },
  },
});
