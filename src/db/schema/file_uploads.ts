import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { InferModel } from "drizzle-orm";
export const file_uploads = sqliteTable("file_uploads", {
  // id is set on insert, incrementing
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  // userId: integer("userId", { mode: "number" }).notNull(),
  fileName: text("fileName"),
  size: integer("size", { mode: "number" }).notNull(),
  mimeType: text("mimeType").notNull(),
  // timestamp is set on insert
  timestamp: text("timestamp")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type FileUpload = InferModel<typeof file_uploads>;
