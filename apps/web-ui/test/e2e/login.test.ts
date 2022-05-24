import { test, expect } from "@playwright/test";
import authTest from "../fixtures/auth-test";
import { TEST_USER } from "../test-consts";

test.beforeEach(async ({ page }) => {
  await page.goto("/auth");
});

test.describe("Login", () => {
  authTest("unauthorized login", async ({ page, user }) => {
    const loginTitle = await page.locator("text=Login", {
      hasText: /^Login$/i,
    });

    await expect(loginTitle).toBeVisible();

    await page.fill('input[name="username"]', TEST_USER.INVALID.USERNAME);
    await page.fill('input[name="password"]', TEST_USER.INVALID.PASSWORD);
    await page.click('button:has-text("Continue")');

    const unauthorizedText = await page.locator("text=Unauthorized");

    await expect(unauthorizedText).toBeVisible();
  });

  authTest("authorized login", async ({ page, user }) => {
    const loginTitle = await page.locator("text=Login", {
      hasText: /^Login$/i,
    });

    await expect(loginTitle).toBeVisible();

    await page.fill('input[name="username"]', user.username);
    await page.fill('input[name="password"]', user.password);
    await page.click('button:has-text("Continue")');

    const settingsButton = await page.locator('[aria-label="Open settings"]');

    await expect(settingsButton).toBeVisible();
  });
});

test.describe("Login Form", async () => {
  authTest(
    "should react according to the constraints",
    async ({ page, user }) => {
      const button = await page.locator('button:has-text("Continue")');
      const usernameInput = await page.locator('input[name="username"]');
      const passwordInput = await page.locator('input[name="password"]');

      expect(button).toBeDisabled();

      await usernameInput.fill(user.username);

      expect(button).toBeDisabled();

      await passwordInput.fill(user.password);

      expect(button).toBeEnabled();

      const passwordInputValue = await page.$eval(
        'input[name="password"]',
        (el: HTMLInputElement) => el.value,
      );

      for (let i = 0; i < passwordInputValue.length; i++)
        await page.keyboard.press("Backspace");

      await expect(button).toBeDisabled();
    },
  );
});
