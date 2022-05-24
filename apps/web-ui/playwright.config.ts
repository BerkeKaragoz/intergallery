import { PlaywrightTestConfig, devices } from "@playwright/test";
import { BASE_URL } from "./test/test-consts";

const config: PlaywrightTestConfig = {
  testDir: "./test/",
  // forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  globalSetup: require.resolve("./test/global-setup"),
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    // Tell all tests to load signed-in state from 'storageState.json'.
    //storageState: resolve"storageState.json",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
};
export default config;
