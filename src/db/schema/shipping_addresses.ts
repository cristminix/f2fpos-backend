import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { shippings } from "./shippings"
import { InferModel } from "drizzle-orm"

export const shippingAddresses = sqliteTable("shipping_addresses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  shippingId: integer("shippingId").references(() => shippings.id),
  fullName: text("fullName"),
  phoneNumber: text("phoneNumber"),
  street: text("street"),
  subDistrict: text("subDistrict"),
  city: text("city"),
  province: text("province"),
  zipCode: text("zipCode"),
})

export type ShippingAddress = InferModel<typeof shippingAddresses>
