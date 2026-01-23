import { ingredients } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import DrizzleModel from "./DrizzleModel";

class MIngredient extends DrizzleModel {
  schema = ingredients;

  getByNameAndOutletId(name: string, outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(eq(this.schema.name, name), eq(this.schema.outletId, outletId)),
      )
      .get(0);
  }

  getByCode(code: string) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.code, code))
      .get(0);
  }

  getByOutletId(outletId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.outletId, outletId));
  }
}

export default MIngredient;
