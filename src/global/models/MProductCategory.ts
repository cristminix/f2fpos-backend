import { product_categories } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import DrizzleModel from "./DrizzleModel";

class MProductCategory extends DrizzleModel {
  schema = product_categories;

  getByNameAndOutletId(name: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.name, name), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }
}

export default MProductCategory;
