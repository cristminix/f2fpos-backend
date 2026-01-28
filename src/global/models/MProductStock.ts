import DrizzleModel from "./DrizzleModel"
import { productStocks } from "../../db/schema"

export class MProductStock extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = productStocks
  }
}
