import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"

export const product_categories = sqliteTable("product_category", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  outletId: integer("outletId", { mode: "number" }).notNull(),

  name: text("name", { length: 256 }).notNull(),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type ProductCategory = InferModel<typeof product_categories>
