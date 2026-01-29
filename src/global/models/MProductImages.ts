import { eq } from "drizzle-orm"
import { productImages } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
export class MProductImages extends DrizzleModel {
  schema = productImages

  getListByProductId(productId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.productId, productId))
    // .get(0)
  }
}
