import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { members } from "./members"
import { InferModel } from "drizzle-orm"

export const memberBankAccounts = sqliteTable("member_bank_accounts", {
  id: integer("id").primaryKey(),
  memberId: integer("memberId").references(() => members.id),
  bankName: text("bankName"),
  bankCode: text("bankCode"),
  accountNumber: text("accountNumber"),
  accountHolderName: text("accountHolderName"),
})

export type MemberBankAccount = InferModel<typeof memberBankAccounts>
