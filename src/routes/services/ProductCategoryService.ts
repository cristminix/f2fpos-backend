import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import MProductCategory from "../../global/models/MProductCategory"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productCategoryRouteAcls } from "../acls/product_categories"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const productCategoryCreateValidationSchema = z.object({
  name: z.string(),
  outletId: z.number(),
})

const productCategoryUpdateValidationSchema = z.object({
  name: z.string().optional(),
  outletId: z.number().optional(),
})

// Get all product categories
app.get(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productCategoryRouteAcls),
    ),
  async (c) => {
    const mProductCategory = new MProductCategory(c)

    const { limit = 10, page = 1 } = c.req.query()

    const result = await mProductCategory.getList(Number(limit), Number(page))

    return c.json(result)
  },
)

// Get product category by ID
app.get(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mProductCategory = new MProductCategory(c)
    const category = await mProductCategory.getRow(id)

    if (!category) {
      return c.json(
        { success: false, message: "Product category not found" },
        404,
      )
    }

    return c.json({ success: true, data: category })
  },
)

// Create new product category
app.post(
  getListOrCreateRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getListOrCreateRoutePath, productCategoryRouteAcls),
    ),
  zBodyValidator(productCategoryCreateValidationSchema),
  async (c) => {
    const categoryData = c.req.valid("form")

    const mProductCategory = new MProductCategory(c)
    try {
      // Check if category with this name already exists
      const existingCategory = await mProductCategory.getByName(
        categoryData.name,
      )
      if (existingCategory) {
        return c.json(
          {
            success: false,
            message: "Product category with this name already exists",
          },
          409,
        )
      }

      const result = await mProductCategory.create(categoryData)
      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Update product category by ID
app.put(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryRouteAcls),
    ),
  zBodyValidator(productCategoryUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const categoryData = c.req.valid("form")

    const mProductCategory = new MProductCategory(c)

    try {
      // Check if category exists
      const existingCategory = await mProductCategory.getRow(id)
      if (!existingCategory) {
        return c.json(
          { success: false, message: "Product category not found" },
          404,
        )
      }

      if (categoryData.name && categoryData.name !== existingCategory.name) {
        const existingCategoryByName = await mProductCategory.getByName(
          categoryData.name,
        )
        if (existingCategoryByName) {
          return c.json(
            {
              success: false,
              message: "Product category with this name already exists",
            },
            409,
          )
        }
      }

      const result = await mProductCategory.update(id, categoryData)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Delete product category by ID
app.delete(
  getUpdateDeleteRowRoutePath,
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      isInAcl(getUpdateDeleteRowRoutePath, productCategoryRouteAcls),
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    const mProductCategory = new MProductCategory(c)

    try {
      // Check if category exists
      const existingCategory = await mProductCategory.getRow(id)
      if (!existingCategory) {
        return c.json(
          { success: false, message: "Product category not found" },
          404,
        )
      }

      const result = await mProductCategory.delete(id, existingCategory)
      return c.json({ success: true, data: result })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export default app
