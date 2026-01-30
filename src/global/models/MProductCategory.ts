import { product_categories } from "../../db/schema"
import { eq } from "drizzle-orm"
import DrizzleModel from "./DrizzleModel"

class MProductCategory extends DrizzleModel {
  schema = product_categories

  getByName(name: string) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.name, name))
      .get(0)
  }
}

export { MProductCategory }
