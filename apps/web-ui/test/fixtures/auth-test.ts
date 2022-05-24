import { test as base } from "@playwright/test";
import { TEST_USER } from "../test-consts";

type Fixtures = {
  user: { username: string; password: string };
  //login: (props: { page: Page; user: Fixtures["user"] }) => Promise<void>;
};

const authTest = base.extend<Fixtures>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  user: {
    username: TEST_USER.VALID.USERNAME,
    password: TEST_USER.VALID.PASSWORD,
  },
  // login:
  //   ({ page, user }) =>
  //   async () => {
  //     await page.fill('input[name="username"]', user.username);
  //     await page.fill('input[name="password"]', user.password);
  //     await page.click('button:has-text("Continue")');
  //   },
});

export default authTest;
