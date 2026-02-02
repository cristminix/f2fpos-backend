import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProductCategoryImages } from "../../global/models/MProductCategoryImages"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productCategoryImageRouteAcls } from "../acls/product_category_images"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"
const getListByProductCategoryRoutePath = "/by-product-category/:productCategoryId"

const productCategoryImageCreateValidationSchema = z.object({
  productCategoryId: z.number(),
  key: z.string(),
  filename: z.string(),
})

const productCategoryImageUpdateValidationSchema = z.object({
  productCategoryId: z.number().optional(),
  key: z.string().optional(),
  filename: z.string().optional(),
})

// GET / - List all product category images
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productCategoryImageRouteAcls),
    ),
  async (c) => {
    const model = new MProductCategoryImages(c)
    const { limit = 10, page = 1, productCategoryId } = c.req.query()
    const data = await model.getListByProductCategoryId(
      //@ts-ignore
      productCategoryId,
      // Number(limit),
      // Number(page),
    )
    return c.json(data)
  },
)

// GET /by-product-category/:productCategoryId - List all product category images for a specific product category
app.get(
  getListByProductCategoryRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productCategoryImageRouteAcls),
    ),
  async (c) => {
    const productCategoryId = parseInt(c.req.param("productCategoryId"), 10)
    if (isNaN(productCategoryId)) {
      return c.json({ success: false, message: "Invalid Product Category ID" }, 400)
    }

    const model = new MProductCategoryImages(c)
    const data = await model.getListByProductCategoryId(productCategoryId)
    return c.json({ success: true, data })
  },
)

// GET /:id - Get a single product category image
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryImageRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductCategoryImages(c)
    const data = await model.getRow(id)
    if (!data) {
      return c.json({ success: false, message: "Product category image not found" }, 404)
    }
    return c.json({ success: true, data })
  },
)

// POST / - Create a new product category image
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productCategoryImageRouteAcls),
    ),
  zBodyValidator(productCategoryImageCreateValidationSchema),
  async (c) => {
    const productCategoryImageFormData = c.req.valid("form")
    const model = new MProductCategoryImages(c)
    try {
      const { productCategoryId, key, filename } = productCategoryImageFormData

      const productCategoryImageData = { productCategoryId, key, filename }

      const [result] = await model.create(productCategoryImageData)

      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// PUT /:id - Update an existing product category image
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryImageRouteAcls),
    ),
  zBodyValidator(productCategoryImageUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const productCategoryImageData = c.req.valid("form")
    const model = new MProductCategoryImages(c)

    try {
      const existingProductCategoryImage = await model.getRow(id)
      if (!existingProductCategoryImage) {
        return c.json(
          { success: false, message: "Product category image not found" },
          404,
        )
      }

      const result = await model.update(id, productCategoryImageData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// DELETE /:id - Delete a product category image
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryImageRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)
    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }
    const model = new MProductCategoryImages(c)
    try {
      const existingProductCategoryImage = await model.getRow(id)
      if (!existingProductCategoryImage) {
        return c.json(
          { success: false, message: "Product category image not found" },
          404,
        )
      }
      const result = await model.delete(id, existingProductCategoryImage)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export { app as ProductCategoryImageService }
