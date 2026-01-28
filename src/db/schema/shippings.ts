import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { orders } from "./orders"
import { InferModel, sql } from "drizzle-orm"

export const shippings = sqliteTable("shippings", {
  id: integer("id").primaryKey(),
  orderId: integer("orderId").references(() => orders.id),
  shippingMethod: text("shippingMethod"),
  trackingNumber: text("trackingNumber"),
  shippingDate: text("shippingDate"),
  deliveryDate: text("deliveryDate"),
  shippingStatus: text("shippingStatus"),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Shipping = InferModel<typeof shippings>
