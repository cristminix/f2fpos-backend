import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { members } from "./members"
import { InferModel, sql } from "drizzle-orm"

export const memberIdentities = sqliteTable("member_identities", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  memberId: integer("memberId").references(() => members.id),
  idNumber: text("idNumber"),
  photoUrl: text("photoUrl"),
  uploadedAt: text("uploadedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

export type MemberIdentity = InferModel<typeof memberIdentities>
