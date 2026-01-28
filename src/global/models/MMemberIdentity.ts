import DrizzleModel from "./DrizzleModel"
import { memberIdentities } from "../../db/schema"

export class MMemberIdentity extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = memberIdentities
  }
}
