import DrizzleModel from "./DrizzleModel"
import { shippings } from "../../db/schema"

export class MShipping extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = shippings
  }
}
