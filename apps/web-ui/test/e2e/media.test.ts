import { test, expect } from "@playwright/test"
import authTest from "../fixtures/auth-test"

//test.use({ storageState: STORAGE_STATE.AUTH });

test.beforeEach(async ({ page }) => {
   await page.goto("/")
})

test.describe("Add Media", () => {
   authTest("shows no media", async ({ page }) => {
      await expect(await page.locator("text=There isn't any media.")).toBeVisible()
   })

   authTest("add one media", async ({ page }) => {
      const url = "https://picsum.photos/id/2/1600/900"

      // get the first child card and its id
      // add the media
      // then compare the ids (notEqual)
      await page.locator("text=Add Media").click()
      await page.locator('[placeholder="URL \\*"]').click()
      await page.locator('[placeholder="URL \\*"]').fill(url)
      await page.locator('input[name="media\\.0\\.Is Local"]').uncheck()
      await page
         .locator("[aria-labelledby='mui-component-select-media.0.Type']")
         .click()
      await page.locator('li[role="option"]:has-text("PICTURE")').click()
      await page.locator('div[role="dialog"] button:has-text("Add")').click()

      const browseGrid = await page.locator(`data-testid=browse-grid`)

      const addedMediaCard = await browseGrid.locator("li").nth(0)

      await expect(addedMediaCard).toContainText(url)
   })

   authTest("delete media", async ({ page }) => {
      const browseGrid = await page.locator(`data-testid=browse-grid`)

      const addedMediaCard = await browseGrid.locator("li").nth(0)

      await addedMediaCard.click()

      await page.locator("text=Delete").click()
      await page.locator('[placeholder="delete"]').click()
      await page.locator('[placeholder="delete"]').fill("delete")
      await page.locator('div[role="dialog"] button:has-text("Delete")').click()

      await expect(await page.locator("text=There isn't any media.")).toBeVisible()
   })
})
