import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  retries: process.env["CI"] ? 1 : 0,
  workers: 1,
  use: {
    baseURL: process.env["BASE_URL"] ?? "http://localhost:5173",
  },
});
