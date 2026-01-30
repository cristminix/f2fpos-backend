import { integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { InferModel } from "drizzle-orm"
import { products } from "./products"

export const productStocks = sqliteTable("product_stocks", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  productId: integer("productId")
    .references(() => products.id)
    .unique(),
  qty: integer("qty"),
  allocatedQty: integer("allocatedQty"),
})

export type ProductStock = InferModel<typeof productStocks>
