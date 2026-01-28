import { MOrder } from "../../global/models/MOrder"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as orderRouteAcls } from "../acls/orders"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const orderCreateValidationSchema = z.object({
  memberId: z.number(),
  orderNumber: z.string().optional(), // Akan di-generate jika tidak ada
  totalPrice: z.number(),
  shippingCost: z.number(),
  orderStatus: z.string(),
})

const orderUpdateValidationSchema = z.object({
  memberId: z.number().optional(),
  orderNumber: z.string().optional(),
  totalPrice: z.number().optional(),
  shippingCost: z.number().optional(),
  orderStatus: z.string().optional(),
})

// GET / - List all orders
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, orderRouteAcls),
    ),
  async (c) => {
    const model = new MOrder(c)
    const { limit = 10, page = 1 } = c.req.query()
    const data = await model.getList(Number(limit), Number(page))
    return c.json(data)
  },
)

// GET /:id - Get a single order
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MOrder(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Order not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new order
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, orderRouteAcls),
    ),
  zBodyValidator(orderCreateValidationSchema),
  async (c) => {
    const orderData = c.req.valid("form")
    const model = new MOrder(c)

    try {
      // Generate orderNumber if not provided
      if (!orderData.orderNumber) {
        orderData.orderNumber = `ORD-${Date.now()}`
      } else {
        // Check if orderNumber already exists
        const existingOrder = await model.getRow({
          orderNumber: orderData.orderNumber,
        })
        if (existingOrder) {
          return c.json(
            {
              success: false,
              message: "Order with this orderNumber already exists",
            },
            409,
          )
        }
      }

      const result = await model.create(orderData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing order
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderRouteAcls),
    ),
  zBodyValidator(orderUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const orderData = c.req.valid("form")
    const model = new MOrder(c)

    try {
      const existingOrder = await model.getRow(id)
      if (!existingOrder) {
        return c.json({ success: false, message: "Order not found" }, 404)
      }

      if (
        orderData.orderNumber &&
        orderData.orderNumber !== existingOrder.orderNumber
      ) {
        const existingOrderByNumber = await model.getRow({
          orderNumber: orderData.orderNumber,
        })
        if (existingOrderByNumber) {
          return c.json(
            {
              success: false,
              message: "Order with this orderNumber already exists",
            },
            409,
          )
        }
      }

      const result = await model.update(id, orderData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete an order
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, orderRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MOrder(c)
    try {
      const existingOrder = await model.getRow(id)
      if (!existingOrder) {
        return c.json({ success: false, message: "Order not found" }, 404)
      }
      const result = await model.delete(id, existingOrder)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export const OrderService = app
