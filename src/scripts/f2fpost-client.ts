import { loginData } from "./config"
import { getAccessToken } from "./fn/getAccessToken"
import { seedOutlet } from "./seed/seedOutlet"
import { seedProductCategory } from "./seed/seedProductCategory"

const main = async () => {
  // const accessToken = await getAccessToken(loginData)
  // console.log({ accessToken })
  await seedOutlet()
  await seedProductCategory()
}

main().catch((e) => console.error(e))
