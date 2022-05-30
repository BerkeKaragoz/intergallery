import { test, expect } from "@playwright/test"
import authTest from "../fixtures/auth-test"
import { STORAGE_STATE, TEST_USER } from "../test-consts"

test.use({ storageState: STORAGE_STATE.NOAUTH })

test.beforeEach(async ({ page }) => {
   await page.goto("/auth")
})

test.describe("Login Functionality", () => {
   authTest("unauthorized login", async ({ page, user }) => {
      const loginTitle = await page.locator("text=Login", {
         hasText: /^Login$/i,
      })

      await expect(loginTitle).toBeVisible()

      await page.fill('input[name="username"]', TEST_USER.INVALID.USERNAME)
      await page.fill('input[name="password"]', TEST_USER.INVALID.PASSWORD)
      await page.click('button:has-text("Continue")')

      const unauthorizedText = await page.locator("text=Unauthorized")

      await expect(unauthorizedText).toBeVisible()
   })

   authTest("authorized login", async ({ page, user }) => {
      const loginTitle = await page.locator("text=Login", {
         hasText: /^Login$/i,
      })

      await expect(loginTitle).toBeVisible()

      await page.fill('input[name="username"]', user.username)
      await page.fill('input[name="password"]', user.password)
      await page.click('button:has-text("Continue")')

      const settingsButton = await page.locator('[aria-label="Open settings"]')

      await expect(settingsButton).toBeVisible()
   })
})

test.describe("Login Page", async () => {
   authTest(
      "continue button should react according to the constraints",
      async ({ page, user }) => {
         const button = await page.locator('button:has-text("Continue")')
         const usernameInput = await page.locator('input[name="username"]')
         const passwordInput = await page.locator('input[name="password"]')

         expect(button).toBeDisabled()

         await usernameInput.fill(user.username)

         expect(button).toBeDisabled()

         await passwordInput.fill(user.password)

         expect(button).toBeEnabled()

         const passwordInputValue = await page.$eval(
            'input[name="password"]',
            (el: HTMLInputElement) => el.value
         )

         for (let i = 0; i < passwordInputValue.length; i++)
            await page.keyboard.press("Backspace")

         await expect(button).toBeDisabled()
      }
   )

   authTest("password visibility", async ({ page, user }) => {
      const passwordInput = await page.locator('input[name="password"]')
      const passVisButton = await page.locator(
         '[aria-label="toggle password visibility"]'
      )
      const passVisIcon = await page.locator("svg[data-testid=VisibilityIcon]")

      await expect(passVisIcon).toBeVisible()
      expect(passwordInput).toHaveAttribute("type", "password")
      await expect(passwordInput).toBeEditable()

      await passVisButton.click()

      const passVisOffIcon = await page.locator("svg[data-testid=VisibilityOffIcon]")

      await expect(passVisOffIcon).toBeVisible()
      await expect(passwordInput).toHaveAttribute("type", "text")
      await expect(passwordInput).toBeEditable()

      await passVisButton.click()

      await expect(passVisIcon).toBeVisible()
      expect(passwordInput).toHaveAttribute("type", "password")
      await expect(passwordInput).toBeEditable()
   })

   authTest("should be able to go to sign up", async ({ page }) => {
      await page.click('a:has-text("Sign up")')

      const signUpTitle = await page.locator('h1:has-text("Sign Up")')

      await expect(signUpTitle).toBeVisible()
   })
})
