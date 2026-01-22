import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import { InferModel } from "drizzle-orm"

export const app_roles = sqliteTable("app_roles", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull(),
  roleType: text("roleType", { length: 256 }),
  enabled: integer("enabled", { mode: "boolean" }).default(true),
  path: text("path", { length: 512 }),
  contents: text("contents"),
  description: text("description", { length: 512 }),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type AppRole = InferModel<typeof app_roles>
