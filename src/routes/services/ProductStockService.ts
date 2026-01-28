import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProductStock } from "../../global/models/MProductStock"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productStockRouteAcls } from "../acls/product_stocks"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const productStockCreateValidationSchema = z.object({
  productId: z.number(),
  qty: z.number(),
  allocatedQty: z.number(),
})

const productStockUpdateValidationSchema = z.object({
  productId: z.number().optional(),
  qty: z.number().optional(),
  allocatedQty: z.number().optional(),
})

// GET / - List all product stocks
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productStockRouteAcls),
    ),
  async (c) => {
    const model = new MProductStock(c)
    const { limit = 10, page = 1 } = c.req.query()
    const data = await model.getList(Number(limit), Number(page))
    return c.json(data)
  },
)

// GET /:id - Get a single product stock
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productStockRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductStock(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Product stock not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new product stock
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productStockRouteAcls),
    ),
  zBodyValidator(productStockCreateValidationSchema),
  async (c) => {
    const productStockData = c.req.valid("form")
    const model = new MProductStock(c)

    try {
      const existingProductStock = await model.getByProductId(
        productStockData.productId,
      )
      if (existingProductStock) {
        return c.json(
          {
            success: false,
            message: "Product stock for this product already exists",
          },
          409,
        )
      }

      const result = await model.create(productStockData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing product stock
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productStockRouteAcls),
    ),
  zBodyValidator(productStockUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const productStockData = c.req.valid("form")
    const model = new MProductStock(c)

    try {
      const existingProductStock = await model.getRow(id)
      if (!existingProductStock) {
        return c.json(
          { success: false, message: "Product stock not found" },
          404,
        )
      }

      if (
        productStockData.productId &&
        productStockData.productId !== existingProductStock.productId
      ) {
        const existingByProductId = await model.getByProductId(
          productStockData.productId,
        )
        if (existingByProductId) {
          return c.json(
            {
              success: false,
              message: "Product stock for this product already exists",
            },
            409,
          )
        }
      }

      const result = await model.update(id, productStockData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete a product stock
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productStockRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductStock(c)
    try {
      const existingProductStock = await model.getRow(id)
      if (!existingProductStock) {
        return c.json(
          { success: false, message: "Product stock not found" },
          404,
        )
      }
      const result = await model.delete(id, existingProductStock)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export { app as ProductStockService }
