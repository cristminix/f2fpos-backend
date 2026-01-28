import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { InferModel, sql } from "drizzle-orm"

export const members = sqliteTable("members", {
  id: integer("id").primaryKey(),
  fullName: text("fullName"),
  email: text("email").unique(),
  phoneNumber: text("phoneNumber"),
  passwordHash: text("password"),
  memberType: text("memberType") /*OWNER,DISTRIBUTOR,RESELLER*/,
  /**/
  accountStatus: text("accountStatus"),
  createdAt: text("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type Member = InferModel<typeof members>
