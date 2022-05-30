export const BASE_URL = "http://localhost:3000" as const

export const STORAGE_STATE = {
   AUTH: "authStorageState.test.json",
   NOAUTH: "noauthStorageState.test.json",
} as const

export const TEST_USER = {
   VALID: {
      USERNAME: "__username",
      PASSWORD: "__password",
   },
   INVALID: {
      USERNAME: "! __username",
      PASSWORD: "! __password",
   },
} as const
