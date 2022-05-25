import { test, chromium, expect } from "@playwright/test";

test.beforeEach(async () => {
  //ensure a media exists
  const url = "https://picsum.photos/id/2/1600/900";

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("/");

  const isMediaEmpty = await page.$("text=There isn't any media.");

  if (isMediaEmpty === null) {
    await page.click("text=Add Media");
    await page.click('[placeholder="URL \\*"]');
    await page.locator('[placeholder="URL \\*"]').fill(url);
    await page.locator('input[name="media\\.0\\.Is Local"]').uncheck();
    await page.click("[aria-labelledby='mui-component-select-media.0.Type']");
    await page.click('li[role="option"]:has-text("PICTURE")');
    await page.click('div[role="dialog"] button:has-text("Add")');
  }

  await page.locator("data-testid=browse-card-0");

  await page.close();
  await browser.close();
});

test.afterAll(async () => {
  // delete the media
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("/");

  const browseGrid = await page.locator(`data-testid=browse-grid`);

  const addedMediaCard = await browseGrid.locator("li").nth(0);

  await addedMediaCard.click();

  await page.locator("text=Delete").click();
  await page.locator('[placeholder="delete"]').click();
  await page.locator('[placeholder="delete"]').fill("delete");
  await page.locator('div[role="dialog"] button:has-text("Delete")').click();

  await page.goto("/");
  await page.locator("text=There isn't any media.");

  await page.close();
  await browser.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Browse", () => {
  test("sidebar shows info on hover", async ({ page }) => {
    const mediaCard = await page.locator("data-testid=browse-card-0");
    const sidebar = await page.locator("data-testid=browse-sidebar");

    await mediaCard.hover();

    const mediaName = await mediaCard.locator("span").textContent();

    const infoName = await sidebar.locator(`text=${mediaName}`);

    await expect(infoName).toBeVisible();
  });
});
