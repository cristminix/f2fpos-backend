import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { InferModel } from "drizzle-orm"
import { product_categories } from "./product_categories"

export const productCategoryImages = sqliteTable("product_category_images", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  key: text("key").notNull(),
  productCategoryId: integer("product_category_id")
    .notNull()
    .references(() => product_categories.id, { onDelete: "cascade" }),
})

export type ProductCategoryImage = InferModel<typeof productCategoryImages>
