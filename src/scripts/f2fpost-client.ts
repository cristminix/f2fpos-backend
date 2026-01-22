import { loginData } from "./config";
import { getAccessToken } from "./fn/getAccessToken";
import { seedOutlet } from "./seed/seedOutlet";
import { seedProductCategory } from "./seed/seedProductCategory";
import { seedUser } from "./seed/seedUser";

const main = async () => {
  // const accessToken = await getAccessToken(loginData)
  // console.log({ accessToken })
  await seedUser();
  // await seedOutlet()
  // await seedProductCategory()
};

main().catch((e) => console.error(e));
