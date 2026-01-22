import { loginData } from "./config";
import { fetchProductCategory } from "./fetch/fetchProductCategory";
import { getAccessToken } from "./fn/getAccessToken";
import { seedOutlet } from "./seed/seedOutlet";
import { seedProductCategory } from "./seed/seedProductCategory";
import { seedUser } from "./seed/seedUser";

const main = async () => {
  // const accessToken = await getAccessToken(loginData)
  // console.log({ accessToken })
  // await seedUser();
  // await seedOutlet();
  await seedProductCategory();

  fetchProductCategory();
};

main().catch((e) => console.error(e));
