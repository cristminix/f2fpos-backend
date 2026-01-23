import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { InferModel, sql } from "drizzle-orm";

export const stock_inventory = sqliteTable("stock_inventory", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  outletId: integer("outletId", { mode: "number" }).notNull(),
  itemId: integer("itemId", { mode: "number" }).notNull(),
  itemType: text("itemType").notNull(), // Type of item (product, ingredient, etc.)
  minQty: integer("minQty").notNull().default(0), // Minimum quantity threshold
  qty: integer("qty").notNull().default(0), // Current quantity
  notes: text("notes"), // Optional notes about the inventory
  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type StockInventory = InferModel<typeof stock_inventory>;
