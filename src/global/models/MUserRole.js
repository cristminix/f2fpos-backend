import { user_roles } from "../../db/schema"
import DrizzleModel from "./DrizzleModel"
class MUserRole extends DrizzleModel {
	schema = user_roles
}
export default MUser