import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { InferModel } from "drizzle-orm";

export const ingredients = sqliteTable("ingredients", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  outletId: integer("outletId", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  code: text("code", { length: 150 }).notNull(),
  description: text("description", { length: 500 }).notNull(),
  unit: text("unit", { length: 50 }).notNull(),
  alternateUnit: text("alternateUnit", { length: 50 }).notNull(),
  // minQty: integer("minQty", { mode: "number" }).notNull(),

  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Ingredient = InferModel<typeof ingredients>;
