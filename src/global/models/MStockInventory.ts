import { stock_inventory } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import DrizzleModel from "./DrizzleModel";

export class MStockInventory extends DrizzleModel {
  schema = stock_inventory;

  // Add custom methods here if needed
  // For example, finding stock by outletId, itemId and itemType
  getByOutletItemAndType(outletId: number, itemId: number, itemType: string) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(
          eq(this.schema.outletId, outletId),
          eq(this.schema.itemId, itemId),
          eq(this.schema.itemType, itemType),
        ),
      )
      .get(0);
  }

  getByOutletAndItemType(outletId: number, itemType: string) {
    return this.db
      .select()
      .from(this.schema)
      .where(
        and(
          eq(this.schema.outletId, outletId),
          eq(this.schema.itemType, itemType),
        ),
      );
  }
}
