import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProduct } from "../../global/models/MProduct"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productRouteAcls } from "../acls/products"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const productCreateValidationSchema = z.object({
  name: z.string(),
  weight: z.number(),
  price: z.number(),
  description: z.string().optional(),
  sku: z.string(),
})

const productUpdateValidationSchema = z.object({
  name: z.string().optional(),
  weight: z.number().optional(),
  price: z.number().optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
})

// GET / - List all products
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productRouteAcls),
    ),
  async (c) => {
    const model = new MProduct(c)
    const { limit = 10, page = 1 } = c.req.query()
    const data = await model.getList(Number(limit), Number(page))
    return c.json(data)
  },
)

// GET /:id - Get a single product
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProduct(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Product not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new product
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productRouteAcls),
    ),
  zBodyValidator(productCreateValidationSchema),
  async (c) => {
    const productData = c.req.valid("form")
    const model = new MProduct(c)

    try {
      const existingProduct = await model.getBySku(productData.sku)
      if (existingProduct) {
        return c.json(
          { success: false, message: "Product with this SKU already exists" },
          409,
        )
      }

      const result = await model.create(productData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing product
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productRouteAcls),
    ),
  zBodyValidator(productUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const productData = c.req.valid("form")
    const model = new MProduct(c)

    try {
      const existingProduct = await model.getRow(id)
      if (!existingProduct) {
        return c.json({ success: false, message: "Product not found" }, 404)
      }

      if (productData.sku && productData.sku !== existingProduct.sku) {
        const existingBySku = await model.getBySku(productData.sku)
        if (existingBySku) {
          return c.json(
            { success: false, message: "Product with this SKU already exists" },
            409,
          )
        }
      }

      const result = await model.update(id, productData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete a product
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProduct(c)
    try {
      const existingProduct = await model.getRow(id)
      if (!existingProduct) {
        return c.json({ success: false, message: "Product not found" }, 404)
      }
      const result = await model.delete(id, existingProduct)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export { app as ProductService }
