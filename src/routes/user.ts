import { createHonoWithBindings } from "../global/fn/createHonoWithBindings"
import { drizzle } from "drizzle-orm/d1"
import { users } from "../db/schema"
import { validateUserRoles } from "../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../global/fn/isInAcl"
const app = createHonoWithBindings()
import { acls as userRouteAcls } from "./acls/users"
const getListRoutePath = "/getList"

app.get(
  getListRoutePath,
  async (c, next) =>
    validateUserRoles(c, next, isInAcl(getListRoutePath, userRouteAcls)),
  async (c) => {
    const db = drizzle(c.env.DB)
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .all()
    return c.json({
      success: true,
      users: result,
    })
  },
)

export default app
