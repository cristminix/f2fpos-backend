import { loginData } from "./config"
import { getAccessToken } from "./fn/getAccessToken"
import { seedMember } from "./seed/seedMember"
import { seedOutlet } from "./seed/seedOutlet"
import { seedProductCategory } from "./seed/seedProductCategory"
import { seedProducts } from "./seed/seedProducts"

const main = async () => {
  // const accessToken = await getAccessToken(loginData)
  // console.log({ accessToken })
  // await seedOutlet()
  // await seedProductCategory()
  // await seedMember()
  await seedProducts()
}

main().catch((e) => console.error(e))
