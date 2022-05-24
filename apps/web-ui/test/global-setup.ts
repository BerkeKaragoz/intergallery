// global-setup.ts
import { request, chromium, FullConfig } from "@playwright/test";
import { TEST_USER } from "./test-consts";

async function globalSetup(config: FullConfig) {
  // ensure user exists
  const requestContext = await request.newContext();
  await requestContext.post(
    `${config.projects[0].use.baseURL}/api/auth/register`,
    {
      form: {
        username: TEST_USER.VALID.USERNAME,
        password: TEST_USER.VALID.PASSWORD,
      },
    },
  );

  // Save signed-in state to 'storageState.json'.
  //await page.context().storageState({ path: 'storageState.json' });
}

export default globalSetup;
