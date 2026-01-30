import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { members } from "./members"
import { InferModel } from "drizzle-orm"

export const memberAddresses = sqliteTable("member_addresses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  memberId: integer("memberId").references(() => members.id),
  street: text("street"),
  subDistrict: text("subDistrict"),
  city: text("city"),
  province: text("province"),
  zipCode: text("zipCode"),
  isPrimary: integer("isPrimary", { mode: "boolean" }),
})

export type MemberAddress = InferModel<typeof memberAddresses>
