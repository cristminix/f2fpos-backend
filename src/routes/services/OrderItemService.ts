import { MOrderItem } from "../../global/models/MOrderItem"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as orderItemRouteAcls } from "../acls/order_items"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const orderItemCreateValidationSchema = z.object({
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number(),
  price: z.number(),
})

const orderItemUpdateValidationSchema = z.object({
  orderId: z.number().optional(),
  productId: z.number().optional(),
  quantity: z.number().optional(),
  price: z.number().optional(),
})

// GET / - List all order items
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, orderItemRouteAcls),
    ),
  async (c) => {
    const model = new MOrderItem(c)
    const { limit = 10, page = 1 } = c.req.query()
    const data = await model.getList(Number(limit), Number(page))
    return c.json(data)
  },
)

// GET /:id - Get a single order item
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderItemRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MOrderItem(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Order item not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new order item
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, orderItemRouteAcls),
    ),
  zBodyValidator(orderItemCreateValidationSchema),
  async (c) => {
    const orderItemData = c.req.valid("form")
    const model = new MOrderItem(c)

    try {
      const result = await model.create(orderItemData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing order item
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderItemRouteAcls),
    ),
  zBodyValidator(orderItemUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const orderItemData = c.req.valid("form")
    const model = new MOrderItem(c)

    try {
      const existingOrderItem = await model.getRow(id)
      if (!existingOrderItem) {
        return c.json({ success: false, message: "Order item not found" }, 404)
      }

      const result = await model.update(id, orderItemData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete an order item
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderItemRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MOrderItem(c)
    try {
      const existingOrderItem = await model.getRow(id)
      if (!existingOrderItem) {
        return c.json({ success: false, message: "Order item not found" }, 404)
      }
      const result = await model.delete(id, existingOrderItem)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export const OrderItemService = app
