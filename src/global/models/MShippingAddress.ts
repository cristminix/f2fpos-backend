import DrizzleModel from "./DrizzleModel"
import { shippingAddresses } from "../../db/schema"

export class MShippingAddress extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = shippingAddresses
  }
}
