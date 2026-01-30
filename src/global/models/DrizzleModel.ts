import { count, sql, eq, and, asc, desc, like, or } from "drizzle-orm"
import DrizzleBaseModel from "./DrizzleBaseModel"
import { calculateTotalPages } from "../fn/calculateTotalPages"
import { calculateOffset } from "../fn/calculateOffset"

class DrizzleModel extends DrizzleBaseModel {
  async update(pk, row_) {
    const row = { ...row_ }
    delete row[this.pk]
    return await this.db
      .update(this.schema)
      .set(row)
      .where(eq(this.schema[this.pk], pk))
      .returning()
  }
  async updateByFieldFilter(field, value, row_) {
    const row = { ...row_ }

    delete row[this.pk]
    return await this.db
      .update(this.schema)
      .set(row)
      .where(eq(this.schema[field], value))
      .returning()
  }
  async delete(pk, row) {
    return await this.db
      .delete(this.schema)
      .where(eq(this.schema[this.pk], pk))
      .returning()
  }
  async create(row_) {
    console.log('create() input:', row_)
    console.log('pk field:', this.pk)
    const row = { ...row_ }
    // Remove primary key field to allow auto-increment
    delete row[this.pk]
    console.log('create() after delete pk:', row)
    return await this.db.insert(this.schema).values(row).returning()
  }
}

export default DrizzleModel
