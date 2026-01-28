import DrizzleModel from "./DrizzleModel"
import { members } from "../../db/schema"
import { eq } from "drizzle-orm"

export class MMember extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = members
  }

  async getByEmail(email: string) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.email, email))
    return result[0]
  }
}
