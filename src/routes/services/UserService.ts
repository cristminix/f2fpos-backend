import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { drizzle } from "drizzle-orm/d1"
import { users } from "../../db/schema"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { encryptPassword } from "../../global/fn/encryptPassword"
const app = createHonoWithBindings()
import { acls as userRouteAcls } from "../acls/users"
import MUser from "../../global/models/MUser"
const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const userCreateValidationSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const userUpdateValidationSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})

app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, userRouteAcls),
    ),
  async (c) => {
    const mUser = new MUser(c)

    const { limit = 10, page = 1 } = c.req.query()

    const result = await mUser.getList(Number(limit), Number(page))

    return c.json(result)
  },
)
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, userRouteAcls),
    ),
  zBodyValidator(userUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"))
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const userData = c.req.valid("form")
    const mUser = new MUser(c)

    try {
      const existingUser = await mUser.getRow(id)
      if (!existingUser) {
        return c.json({ success: false, message: "User not found" }, 404)
      }

      if (userData.username && userData.username !== existingUser.username) {
        const existingUserByUsername = await mUser.getByUsername(
          userData.username,
        )
        if (existingUserByUsername) {
          return c.json(
            {
              success: false,
              message: "User with this username already exists",
            },
            409,
          )
        }
      }

      if (userData.email && userData.email !== existingUser.email) {
        const existingUserByEmail = await mUser.getByEmail(userData.email)
        if (existingUserByEmail) {
          return c.json(
            {
              success: false,
              message: "User with this email already exists",
            },
            409,
          )
        }
      }

      const dataToUpdate: any = { ...userData }
      if (userData.password && userData.password.length > 0) {
        dataToUpdate.password = await encryptPassword(
          userData.password,
          c.env.JWT_SECRET,
        )
      } else {
        delete dataToUpdate.password
      }

      const result = await mUser.update(id, dataToUpdate)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, userRouteAcls),
    ),
  zBodyValidator(userCreateValidationSchema),
  async (c) => {
    const userData = c.req.valid("form")
    const mUser = new MUser(c)

    try {
      // Check if user with this username or email already exists
      const existingUserByUsername = await mUser.getByUsername(
        userData.username,
      )
      if (existingUserByUsername) {
        return c.json(
          {
            success: false,
            message: "User with this username already exists",
          },
          409,
        )
      }

      const existingUserByEmail = await mUser.getByEmail(userData.email)
      if (existingUserByEmail) {
        return c.json(
          {
            success: false,
            message: "User with this email already exists",
          },
          409,
        )
      }

      const hashedPassword = await encryptPassword(
        userData.password,
        c.env.JWT_SECRET,
      )

      const result = await mUser.create({
        ...userData,
        password: hashedPassword,
      })
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, userRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"))

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mUser = new MUser(c)
    const user = await mUser.getRow(id)

    if (!user) {
      return c.json({ success: false, message: "User not found" }, 404)
    }

    const { password, ...userData } = user
    return c.json({ success: true, data: userData })
  },
)

app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, userRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"))
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mUser = new MUser(c)

    try {
      const existingUser = await mUser.getRow(id)
      if (!existingUser) {
        return c.json({ success: false, message: "User not found" }, 404)
      }

      const result = await mUser.delete(id, existingUser)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export default app
