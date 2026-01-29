import { sqliteTable, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"
import { product_categories } from "./product_categories"
import { products } from "./products"

export const productCategoryProducts = sqliteTable(
  "product_category_products",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    categoryId: integer("category_id", { mode: "number" })
      .notNull()
      .references(() => product_categories.id, { onDelete: "cascade" }),
    productId: integer("product_id", { mode: "number" })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    // timestamp is set on insert
    timestamp: integer("timestamp", { mode: "timestamp_ms" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
)

export type ProductCategoryProduct = InferModel<typeof productCategoryProducts>
