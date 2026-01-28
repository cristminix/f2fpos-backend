import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { orders } from "./orders"
import { InferModel, sql } from "drizzle-orm"

export const paymentTransactions = sqliteTable("payment_transactions", {
  id: integer("id").primaryKey(),
  orderId: integer("orderId").references(() => orders.id),
  transactionId: text("transactionId").unique(),
  paymentMethod: text("paymentMethod"),
  paymentCode: text("paymentCode"),
  amount: integer("amount"),
  transactionStatus: text("transactionStatus"),
  transactionDate: text("transactionDate")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type PaymentTransaction = InferModel<typeof paymentTransactions>
