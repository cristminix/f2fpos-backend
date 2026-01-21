import { createHonoWithBindings } from "../global/fn/createHonoWithBindings"
import postRouter from "./post"
import userRouter from "./user"
import LoginServiceRouter from "./services/LoginService"

const app = createHonoWithBindings()

app.route("/posts", postRouter)
app.route("/users", userRouter)
app.route("/LoginService", LoginServiceRouter)

export default app
