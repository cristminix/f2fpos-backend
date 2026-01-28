import { MMember } from "../../global/models/MMember"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { encryptPassword } from "../../global/fn/encryptPassword"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as memberRouteAcls } from "../acls/members"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const memberCreateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string(),
  memberType: z.string().optional(),
  accountStatus: z.string().optional(),
})

const memberUpdateSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  password: z.string().optional(),
  memberType: z.string().optional(),
  accountStatus: z.string().optional(),
})

// List
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, memberRouteAcls),
    ),
  async (c) => {
    const model = new MMember(c)
    const { limit = 10, page = 1 } = c.req.query()
    const data = await model.getList(Number(limit), Number(page))
    return c.json(data)
  },
)

// Get by ID
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, memberRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MMember(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Member not found" }, 404)
    }
    const { passwordHash, ...memberData } = data
    return c.json({ success: true, data: memberData })
  },
)

// Create
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, memberRouteAcls),
    ),
  zBodyValidator(memberCreateSchema),
  async (c) => {
    const memberData = c.req.valid("form")
    const model = new MMember(c)

    try {
      const existingMember = await model.getByEmail(memberData.email)
      if (existingMember) {
        return c.json({ success: false, message: "Email already in use" }, 409)
      }

      const { password, ...rest } = memberData
      const passwordHash = await encryptPassword(password, c.env.JWT_SECRET)
      const result = await model.create({
        ...rest,
        passwordHash,
      })
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Update
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, memberRouteAcls),
    ),
  zBodyValidator(memberUpdateSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const memberData = c.req.valid("form")
    const model = new MMember(c)

    try {
      const existingMember = await model.getRow(id)
      if (!existingMember) {
        return c.json({ success: false, message: "Member not found" }, 404)
      }

      if (memberData.email && memberData.email !== existingMember.email) {
        const existingByEmail = await model.getByEmail(memberData.email)
        if (existingByEmail) {
          return c.json(
            { success: false, message: "Email already in use" },
            409,
          )
        }
      }

      const dataToUpdate: any = { ...memberData }
      if (memberData.password && memberData.password.length > 0) {
        dataToUpdate.passwordHash = await encryptPassword(
          memberData.password,
          c.env.JWT_SECRET,
        )
      }
      delete dataToUpdate.password

      const result = await model.update(id, dataToUpdate)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Delete
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, memberRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MMember(c)
    try {
      const existingMember = await model.getRow(id)
      if (!existingMember) {
        return c.json({ success: false, message: "Member not found" }, 404)
      }
      const result = await model.delete(id, existingMember)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export default app
