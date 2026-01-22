import { outlets } from "../../db/schema"
import { eq } from "drizzle-orm"
import DrizzleModel from "./DrizzleModel"

class MOutlet extends DrizzleModel {
  schema = outlets

  getRowByUserId(userId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.userId, userId))
      .get(0)
  }

  getOutletsByUserId(userId: number) {
    return this.db
      .select()
      .from(this.schema)
      .where(eq(this.schema.userId, userId))
      .all()
  }
}

export default MOutlet
