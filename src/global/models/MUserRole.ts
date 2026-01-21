import { user_roles } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
class MUserRole extends DrizzleModel {
  schema = user_roles

  getRowByUserId(userId: number) {}
}
export default MUserRole
