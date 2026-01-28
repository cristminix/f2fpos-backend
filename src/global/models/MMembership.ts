import DrizzleModel from "./DrizzleModel"
import { memberships } from "../../db/schema"

export class MMembership extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = memberships
  }
}
