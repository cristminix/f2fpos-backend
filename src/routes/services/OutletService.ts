import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import MOutlet from "../../global/models/MOutlet"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as outletRouteAcls } from "../acls/outlets"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const outletCreateValidationSchema = z.object({
  userId: z.number(),
  name: z.string(),
  address: z.string(),
  businessType: z.string(),
  logo: z.string().optional(),
  tax: z.number().optional(),
  settings: z.string().optional(),
})

const outletUpdateValidationSchema = z.object({
  userId: z.number().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  businessType: z.string().optional(),
  logo: z.string().optional(),
  tax: z.number().optional(),
  settings: z.string().optional(),
})

// Get all outlets
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, outletRouteAcls),
    ),
  async (c) => {
    const mOutlet = new MOutlet(c)

    const { limit = 10, page = 1 } = c.req.query()

    const result = await mOutlet.getList(Number(limit), Number(page))

    return c.json(result)
  },
)

// Get outlet by ID
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, outletRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mOutlet = new MOutlet(c)
    const outlet = await mOutlet.getRow(id)

    if (!outlet) {
      return c.json({ success: false, message: "Outlet not found" }, 404)
    }

    return c.json({ success: true, data: outlet })
  },
)

// Create new outlet
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, outletRouteAcls),
    ),
  zBodyValidator(outletCreateValidationSchema),
  async (c) => {
    const outletData = c.req.valid("form")
    const mOutlet = new MOutlet(c)

    try {
      const existingOutlet = await mOutlet.getByName(outletData.name)
      if (existingOutlet) {
        return c.json(
          { success: false, message: "Outlet with this name already exists" },
          409,
        )
      }

      const result = await mOutlet.create(outletData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Update outlet by ID
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, outletRouteAcls),
    ),
  zBodyValidator(outletUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const outletData = c.req.valid("form")

    const mOutlet = new MOutlet(c)

    try {
      const existingOutlet = await mOutlet.getRow(id)
      if (!existingOutlet) {
        return c.json({ success: false, message: "Outlet not found" }, 404)
      }

      if (outletData.name && outletData.name !== existingOutlet.name) {
        const existingOutletByName = await mOutlet.getByName(outletData.name)
        if (existingOutletByName) {
          return c.json(
            { success: false, message: "Outlet with this name already exists" },
            409,
          )
        }
      }

      const result = await mOutlet.update(id, outletData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Delete outlet by ID
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, outletRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mOutlet = new MOutlet(c)

    try {
      const existingOutlet = await mOutlet.getRow(id)
      if (!existingOutlet) {
        return c.json({ success: false, message: "Outlet not found" }, 404)
      }

      const result = await mOutlet.delete(id, existingOutlet)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export default app
