import { createHonoWithBindings } from "../global/fn/createHonoWithBindings"
import postRouter from "./post"
import userRouter from "./user"
import LoginServiceRouter from "./services/LoginService"
import OutletServiceRouter from "./services/OutletService"
import ProductCategoryServiceRouter from "./services/ProductCategoryService"
import MemberServiceRouter from "./services/MemberService"
import MembershipServiceRouter from "./services/MembershipService"
import MemberAddressServiceRouter from "./services/MemberAddressService"
import MemberBankAccountServiceRouter from "./services/MemberBankAccountService"
import MemberIdentityServiceRouter from "./services/MemberIdentityService"
import { OrderService } from "./services/OrderService"
import { OrderItemService } from "./services/OrderItemService"
import { ShippingService } from "./services/ShippingService"
import { ShippingAddressService } from "./services/ShippingAddressService"
import { PaymentTransactionService } from "./services/PaymentTransactionService"
import { ProductService } from "./services/ProductService"
import { ProductStockService } from "./services/ProductStockService"

const app = createHonoWithBindings()

app.route("/posts", postRouter)
app.route("/users", userRouter)
app.route("/LoginService", LoginServiceRouter)
app.route("/OutletService", OutletServiceRouter)
app.route("/ProductCategoryService", ProductCategoryServiceRouter)
app.route("/MemberService", MemberServiceRouter)
app.route("/MembershipService", MembershipServiceRouter)
app.route("/MemberAddressService", MemberAddressServiceRouter)
app.route("/MemberBankAccountService", MemberBankAccountServiceRouter)
app.route("/MemberIdentityService", MemberIdentityServiceRouter)
app.route("/OrderService", OrderService)
app.route("/OrderItemService", OrderItemService)
app.route("/ShippingService", ShippingService)
app.route("/ShippingAddressService", ShippingAddressService)
app.route("/PaymentTransactionService", PaymentTransactionService)
app.route("/ProductService", ProductService)
app.route("/ProductStockService", ProductStockService)

export default app
