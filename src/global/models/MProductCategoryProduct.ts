import { productCategoryProducts } from "../../db/schema"
import { eq } from "drizzle-orm"
import DrizzleModel from "./DrizzleModel"

class MProductCategoryProduct extends DrizzleModel {
  schema = productCategoryProducts


}

export { MProductCategoryProduct }
