import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { members } from "./members"
import { InferModel, sql } from "drizzle-orm"

export const orders = sqliteTable("orders", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  memberId: integer("memberId").references(() => members.id),
  orderNumber: text("orderNumber").unique(),
  orderDate: text("orderDate")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  totalPrice: integer("totalPrice"),
  shippingCost: integer("shippingCost"),
  orderStatus: text("orderStatus"),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Order = InferModel<typeof orders>
