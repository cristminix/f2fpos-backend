import DrizzleModel from "./DrizzleModel"
import { products } from "../../db/schema"

export class MProduct extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = products
  }
}
