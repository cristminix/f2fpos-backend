import { products } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import DrizzleModel from "./DrizzleModel";

export class MProduct extends DrizzleModel {
  schema = products;

  // Add custom methods here if needed
  // For example, finding products by name and outletId
  getByNameAndOutletId(name: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.name, name), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }

  getByCodeAndOutletId(code: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.code, code), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }
}
