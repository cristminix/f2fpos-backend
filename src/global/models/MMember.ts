import DrizzleModel from "./DrizzleModel"
import { members } from "../../db/schema"

export class MMember extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = members
  }
}
