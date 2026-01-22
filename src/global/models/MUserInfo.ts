import { eq } from "drizzle-orm"
import { user_info } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
class MUserInfo extends DrizzleModel {
  schema = user_info

  getRowByUserId(userId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.userId, userId))
      .get(0)
  }
}
export default MUserInfo
