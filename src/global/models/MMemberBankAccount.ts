import DrizzleModel from "./DrizzleModel"
import { memberBankAccounts } from "../../db/schema"

export class MMemberBankAccount extends DrizzleModel {
  constructor(c: any) {
    super(c)
    this.schema = memberBankAccounts
  }
}
