import DrizzleModel from "./DrizzleModel"
import { memberAddresses } from "../../db/schema"

export class MMemberAddress extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = memberAddresses
  }
}
