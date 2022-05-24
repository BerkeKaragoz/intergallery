import { test as base } from "@playwright/test";
import { TEST_USER } from "../test-consts";

type Fixtures = {
  user: { username: string; password: string };
  //login: typeof base;
};

const authTest = base.extend<Fixtures>({
  // Define an option and provide a default value.
  // We can later override it in the config.
  user: {
    username: TEST_USER.VALID.USERNAME,
    password: TEST_USER.VALID.PASSWORD,
  },
  //login: async () => {},
});

export default authTest;
