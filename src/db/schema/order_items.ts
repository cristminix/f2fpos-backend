import { integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { orders } from "./orders"
import { InferModel } from "drizzle-orm"
import { products } from "./products"

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey(),
  orderId: integer("orderId").references(() => orders.id),
  productId: integer("productId").references(() => products.id),
  quantity: integer("quantity"),
  price: integer("price"),
})

export type OrderItem = InferModel<typeof orderItems>
