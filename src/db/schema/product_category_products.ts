import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"
import { product_categories } from "./product_categories"
import { products } from "./products"

export const productCategoryProducts = sqliteTable(
  "product_category_products",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    categoryId: integer("categoryId", { mode: "number" })
      .notNull()
      .references(() => product_categories.id, { onDelete: "cascade" }),
    productId: integer("productId", { mode: "number" })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

  },
)

export type ProductCategoryProduct = InferModel<typeof productCategoryProducts>
