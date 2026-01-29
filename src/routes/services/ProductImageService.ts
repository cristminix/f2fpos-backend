import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProductImages } from "../../global/models/MProductImages"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productImageRouteAcls } from "../acls/product_images"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"
const getListByProductRoutePath = "/by-product/:productId"

const productImageCreateValidationSchema = z.object({
  productId: z.number(),
  key: z.string(),
  filename: z.string(),
})

const productImageUpdateValidationSchema = z.object({
  productId: z.number().optional(),
  key: z.string().optional(),
  filename: z.string().optional(),
})

// GET / - List all product images
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productImageRouteAcls),
    ),
  async (c) => {
    const model = new MProductImages(c)
    const { limit = 10, page = 1, productId } = c.req.query()
    const data = await model.getListByProductId(
      productId,
      // Number(limit),
      // Number(page),
    )
    return c.json(data)
  },
)

// GET /by-product/:productId - List all product images for a specific product
app.get(
  getListByProductRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productImageRouteAcls),
    ),
  async (c) => {
    const productId = parseInt(c.req.param("productId"), 10)
    if (isNaN(productId)) {
      return c.json({ success: false, message: "Invalid Product ID" }, 400)
    }

    const model = new MProductImages(c)
    const data = await model.getListByProductId(productId)
    return c.json({ success: true, data })
  },
)

// GET /:id - Get a single product image
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productImageRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductImages(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Product image not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new product image
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productImageRouteAcls),
    ),
  zBodyValidator(productImageCreateValidationSchema),
  async (c) => {
    const productImageFormData = c.req.valid("form")
    const model = new MProductImages(c)
    try {
      const { productId, key, filename } = productImageFormData

      const productImageData = { productId, key, filename }

      const [result] = await model.create(productImageData)

      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing product image
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productImageRouteAcls),
    ),
  zBodyValidator(productImageUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const productImageData = c.req.valid("form")
    const model = new MProductImages(c)

    try {
      const existingProductImage = await model.getRow(id)
      if (!existingProductImage) {
        return c.json(
          { success: false, message: "Product image not found" },
          404,
        )
      }

      const result = await model.update(id, productImageData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete a product image
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productImageRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductImages(c)
    try {
      const existingProductImage = await model.getRow(id)
      if (!existingProductImage) {
        return c.json(
          { success: false, message: "Product image not found" },
          404,
        )
      }
      const result = await model.delete(id, existingProductImage)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export { app as ProductImageService }
