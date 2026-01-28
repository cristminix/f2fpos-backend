import DrizzleModel from "./DrizzleModel"
import { products } from "../../db/schema"
import { eq } from "drizzle-orm"

export class MProduct extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = products
  }

  async getBySku(sku: string) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.sku, sku))
    return result[0]
  }
}
