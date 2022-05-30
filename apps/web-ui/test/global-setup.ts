// global-setup.ts
import { FullConfig, request } from "@playwright/test"
import { STORAGE_STATE, TEST_USER } from "./test-consts"

async function globalSetup(config: FullConfig) {
   // ensure user exists
   const requestContext = await request.newContext()
   await requestContext.storageState({ path: STORAGE_STATE.NOAUTH })

   await requestContext.post(`${config.projects[0].use.baseURL}/api/auth/register`, {
      form: {
         username: TEST_USER.VALID.USERNAME,
         password: TEST_USER.VALID.PASSWORD,
      },
   })

   const user = await requestContext
      .post(`${config.projects[0].use.baseURL}/api/auth/login`, {
         form: {
            username: TEST_USER.VALID.USERNAME,
            password: TEST_USER.VALID.PASSWORD,
         },
      })
      .then((res) => res.json())
      .then((res) => res)

   const localStorage = [
      {
         name: "lastLogin",
         value: JSON.stringify({
            id: user.id,
            date: new Date().toISOString(),
         }),
      },
   ]

   const origins = [{ origin: config.projects[0].use.baseURL, localStorage }]

   const storageState = await requestContext.storageState()

   storageState.origins = origins

   await requestContext.dispose()

   // We are creating the localStorage by hand, therefore we have to create
   // a new context to be able to inject it since state can only be manipulated
   // at the constructor
   const manuallyHandledContext = await request.newContext({ storageState })

   await manuallyHandledContext.storageState()

   await manuallyHandledContext.storageState({ path: STORAGE_STATE.AUTH })

   await manuallyHandledContext.dispose()
}

export default globalSetup
