import DrizzleModel from "./DrizzleModel"
import { paymentTransactions } from "../../db/schema"

export class MPaymentTransaction extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = paymentTransactions
  }
}
