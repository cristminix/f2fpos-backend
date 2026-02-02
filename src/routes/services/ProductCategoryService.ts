import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProductCategory } from "../../global/models/MProductCategory"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { acls as productCategoryRouteAcls } from "../acls/product_categories"
import { MProductCategoryImages } from "../../global/models/MProductCategoryImages"

const app = createHonoWithBindings()

const getListOrCreateRoutePath = "/"
const getUpdateDeleteRowRoutePath = "/:id"

const productCategoryCreateValidationSchema = z.object({
  name: z.string(),
  // outletId: z.number(),
  fileId: z.string(),

})

const productCategoryUpdateValidationSchema = z.object({
  name: z.string().optional(),
  // outletId: z.number().optional(),
  fileId: z.string().optional(),

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

    const { limit = 10, page = 1,
      sortBy = "id",
      sortOrder = "desc",
    } = c.req.query()
    //@ts-ignore
    const result = await mProductCategory.getListWithImage(Number(limit), Number(page), { [sortBy]: sortOrder })

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
    const { fileId, name } = c.req.valid("form")
    const categoryData = { name, outletId: 1 }

    const mProductCategory = new MProductCategory(c)
    const mProductCategoryImages = new MProductCategoryImages(c)

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

      const [result] = await mProductCategory.create(categoryData)
      let resultFile

      if (result) {
        const [resultFileRow] = await mProductCategoryImages.create({
          productCategoryId: result.id,
          key: fileId,
          filename: fileId,
        })
        resultFile = resultFileRow
      }
      return c.json({ success: true, data: { ...result.fileId } }, 201)
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
    const { fileId, name } = c.req.valid("form")

    const categoryData = { name }

    const mProductCategory = new MProductCategory(c)
    const mProductCategoryImages = new MProductCategoryImages(c)

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

      const [result] = await mProductCategory.update(id, categoryData)
      const existingProductCategoryImages = await mProductCategoryImages.getListByProductCategoryId(id)
      const filtered = existingProductCategoryImages.filter((pci) => pci.key === fileId)
      console.log({ filtered })
      let resultFile = result
      if (result && filtered.length === 0) {
        const [resultFileRow] = await mProductCategoryImages.create({
          productCategoryId: result.id,
          key: fileId,
          filename: fileId,
        })
        resultFile = resultFileRow
      }
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
