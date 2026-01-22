import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"

export const sessions = sqliteTable("sessions", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ipaddr: text("ipaddr", { length: 256 }).notNull(),
  uid: integer("uid", { mode: "number" }).notNull(),
  refreshToken: text("refreshToken", { length: 256 }).notNull(),
  //@ts-ignore
  blacklist: integer("blacklist", { length: 1 }).notNull(),
  kind: text("kind", { length: 50 }).notNull(),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Session = InferModel<typeof sessions>
