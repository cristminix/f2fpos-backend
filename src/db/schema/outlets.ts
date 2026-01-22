import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"

export const outlets = sqliteTable("outlets", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("userId", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  address: text("address", { length: 512 }).notNull(),
  businessType: text("businessType", { length: 100 }).notNull(),
  logo: text("logo", { length: 512 }),
  tax: integer("tax", { mode: "number" }).default(0),
  settings: text("settings").notNull(),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Outlet = InferModel<typeof outlets>
