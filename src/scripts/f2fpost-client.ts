// import { sendLoginRequest } from "./fn/sendLoginRequest"
// import { loadJson, saveJson } from "./fn/jsonUtils"
// import { JSON_CRED_PATH } from "./config"
import { getAccessToken } from "./fn/getAccessToken"
const loginData = {
  email: "demo@example.com",
  password: "password",
}

const main = async () => {
  const accessToken = await getAccessToken(loginData)
  console.log({ accessToken })
}

main().catch((e) => console.error(e))
