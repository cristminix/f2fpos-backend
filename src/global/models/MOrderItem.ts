import DrizzleModel from "./DrizzleModel"
import { orderItems } from "../../db/schema"

export class MOrderItem extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = orderItems
  }
}
