import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { members } from "./members"
import { InferModel, sql } from "drizzle-orm"

export const memberships = sqliteTable("memberships", {
  id: integer("id").primaryKey(),
  memberId: integer("memberId").references(() => members.id),
  tierLevel: text("tierLevel"),
  registrationDate: text("registrationDate")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  expirationDate: text("expirationDate"),
})

export type Membership = InferModel<typeof memberships>
