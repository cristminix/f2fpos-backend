import DrizzleModel from "./DrizzleModel"
import { productStocks } from "../../db/schema"
import { eq } from "drizzle-orm"

export class MProductStock extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = productStocks
  }

  async getByProductId(productId: number) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.productId, productId))
    return result[0]
  }
}
