import { eq } from "drizzle-orm"
import { productCategoryImages } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
export class MProductCategoryImages extends DrizzleModel {
  schema = productCategoryImages

  getListByProductCategoryId(productCategoryId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.productCategoryId, productCategoryId))
    // .get(0)
  }
}
