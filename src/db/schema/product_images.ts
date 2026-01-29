import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { InferModel } from "drizzle-orm"
import { products } from "./products"

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  key: text("key").notNull(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
})

export type ProductImage = InferModel<typeof productImages>
