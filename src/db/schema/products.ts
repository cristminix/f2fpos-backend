import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { InferModel, sql } from "drizzle-orm";

export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  outletId: integer("outletId", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  code: text("code", { length: 150 }).notNull(),
  description: text("description", { length: 500 }).notNull(),
  unit: text("unit", { length: 50 }).notNull(),
  alternateUnit: text("alternateUnit", { length: 50 }).notNull(),
  // minQty: integer("minQty", { mode: "number" }).notNull(),
  image: text("image"),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Product = InferModel<typeof products>;
