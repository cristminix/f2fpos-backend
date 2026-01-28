import { eq } from "drizzle-orm"
import { users } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
class MUser extends DrizzleModel {
  schema = users

  async getByUsername(username: string) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.username, username))
    return result[0]
  }

  async getByEmail(email: string) {
    const result = await this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.email, email))
    return result[0]
  }
}
export default MUser
