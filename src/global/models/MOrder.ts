import DrizzleModel from "./DrizzleModel"
import { orders } from "../../db/schema"

export class MOrder extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = orders
  }
}
