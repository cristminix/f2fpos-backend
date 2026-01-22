import { createHonoWithBindings } from "../global/fn/createHonoWithBindings"
import postRouter from "./post"
import userRouter from "./user"
import LoginServiceRouter from "./services/LoginService"
import OutletServiceRouter from "./services/OutletService"
import ProductCategoryServiceRouter from "./services/ProductCategoryService"

const app = createHonoWithBindings()

app.route("/posts", postRouter)
app.route("/users", userRouter)
app.route("/LoginService", LoginServiceRouter)
app.route("/OutletService", OutletServiceRouter)
app.route("/ProductCategoryService", ProductCategoryServiceRouter)

export default app
