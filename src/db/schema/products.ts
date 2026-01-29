import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { InferModel } from "drizzle-orm"
import { productCategoryProducts } from "./product_category_products"
import { productImages } from "./product_images"

export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  name: text("name"),
  weight: integer("weight"),
  price: integer("price"),
  description: text("description"),
  sku: text("sku"),
})

export type Product = InferModel<typeof products>
