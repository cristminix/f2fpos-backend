import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { validateUserRoles } from "../../middlewares/jwt-validate-user-roles"
import { isInAcl } from "../../global/fn/isInAcl"
import { and, eq, desc } from "drizzle-orm"
import { productCategoryProducts } from "../../db/schema"
import { product_categories, products } from "../../db/schema"
import DrizzleBaseModel from "../../global/models/DrizzleBaseModel"

const app = createHonoWithBindings()

const associateProductToCategoryValidationSchema = z.object({
  categoryId: z.number(),
  productId: z.number(),
})

// Associate a product to a category (create relationship)
app.post(
  "/",
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      ["admin", "manager"], // Adjust roles as needed
    ),
  zBodyValidator(associateProductToCategoryValidationSchema),
  async (c) => {
    const { categoryId, productId } = c.req.valid("form")

    // Create a DrizzleBaseModel instance to access the database
    const dbModel = new DrizzleBaseModel(c)

    try {
      // Verify that both the category and product exist
      const categoryExists = await dbModel.db
        .select()
        .from(product_categories)
        .where(eq(product_categories.id, categoryId))
        .get()
      const productExists = await dbModel.db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .get()

      if (!categoryExists) {
        return c.json(
          { success: false, message: "Product category not found" },
          404,
        )
      }

      if (!productExists) {
        return c.json({ success: false, message: "Product not found" }, 404)
      }

      // Check if association already exists
      const existingAssociation = await dbModel.db
        .select()
        .from(productCategoryProducts)
        .where(
          and(
            eq(productCategoryProducts.categoryId, categoryId),
            eq(productCategoryProducts.productId, productId),
          ),
        )
        .get()

      if (existingAssociation) {
        return c.json(
          {
            success: false,
            message: "Product is already associated with this category",
          },
          409,
        )
      }

      // Create the association
      const result = await dbModel.db
        .insert(productCategoryProducts)
        .values({
          categoryId,
          productId,
        })
        .returning()
        .get()

      return c.json({ success: true, data: result }, 201)
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Remove association between a product and category
app.delete(
  "/:id",
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      ["admin", "manager"], // Adjust roles as needed
    ),
  async (c) => {
    const id = parseInt(c.req.param("id"), 10)

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400)
    }

    // Create a DrizzleBaseModel instance to access the database
    const dbModel = new DrizzleBaseModel(c)

    try {
      const existingAssociation = await dbModel.db
        .select()
        .from(productCategoryProducts)
        .where(eq(productCategoryProducts.id, id))
        .get()

      if (!existingAssociation) {
        return c.json({ success: false, message: "Association not found" }, 404)
      }

      await dbModel.db
        .delete(productCategoryProducts)
        .where(eq(productCategoryProducts.id, id))

      return c.json({
        success: true,
        message: "Association removed successfully",
      })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Remove association by category and product IDs
app.delete(
  "/by-ids/:categoryId/:productId",
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      ["admin", "manager"], // Adjust roles as needed
    ),
  async (c) => {
    const categoryId = parseInt(c.req.param("categoryId"), 10)
    const productId = parseInt(c.req.param("productId"), 10)

    if (isNaN(categoryId) || isNaN(productId)) {
      return c.json({ success: false, message: "Invalid IDs" }, 400)
    }

    // Create a DrizzleBaseModel instance to access the database
    const dbModel = new DrizzleBaseModel(c)

    try {
      const existingAssociation = await dbModel.db
        .select()
        .from(productCategoryProducts)
        .where(
          and(
            eq(productCategoryProducts.categoryId, categoryId),
            eq(productCategoryProducts.productId, productId),
          ),
        )
        .get()

      if (!existingAssociation) {
        return c.json({ success: false, message: "Association not found" }, 404)
      }

      await dbModel.db
        .delete(productCategoryProducts)
        .where(
          and(
            eq(productCategoryProducts.categoryId, categoryId),
            eq(productCategoryProducts.productId, productId),
          ),
        )

      return c.json({
        success: true,
        message: "Association removed successfully",
      })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Get all products in a category
app.get(
  "/by-category/:categoryId",
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      ["admin", "manager", "user"], // Allow users to view products in categories
    ),
  async (c) => {
    const categoryId = parseInt(c.req.param("categoryId"), 10)

    if (isNaN(categoryId)) {
      return c.json({ success: false, message: "Invalid category ID" }, 400)
    }

    // Create a DrizzleBaseModel instance to access the database
    const dbModel = new DrizzleBaseModel(c)

    try {
      const category = await dbModel.db
        .select()
        .from(product_categories)
        .where(eq(product_categories.id, categoryId))
        .get()
      if (!category) {
        return c.json(
          { success: false, message: "Product category not found" },
          404,
        )
      }

      const productCategoryRelations = await dbModel.db
        .select({
          id: productCategoryProducts.id,
          categoryId: productCategoryProducts.categoryId,
          productId: productCategoryProducts.productId,
          timestamp: productCategoryProducts.timestamp,
          product: products,
        })
        .from(productCategoryProducts)
        .innerJoin(products, eq(productCategoryProducts.productId, products.id))
        .where(eq(productCategoryProducts.categoryId, categoryId))
        .orderBy(desc(productCategoryProducts.timestamp))

      return c.json({
        success: true,
        data: productCategoryRelations.map((relation) => relation.product),
        associations: productCategoryRelations,
      })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

// Get all categories for a product
app.get(
  "/by-product/:productId",
  async (c, next) =>
    validateUserRoles(
      c,
      next,
      ["admin", "manager", "user"], // Allow users to view categories for a product
    ),
  async (c) => {
    const productId = parseInt(c.req.param("productId"), 10)

    if (isNaN(productId)) {
      return c.json({ success: false, message: "Invalid product ID" }, 400)
    }

    // Create a DrizzleBaseModel instance to access the database
    const dbModel = new DrizzleBaseModel(c)

    try {
      const product = await dbModel.db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .get()
      if (!product) {
        return c.json({ success: false, message: "Product not found" }, 404)
      }

      const productCategoryRelations = await dbModel.db
        .select({
          id: productCategoryProducts.id,
          categoryId: productCategoryProducts.categoryId,
          productId: productCategoryProducts.productId,
          timestamp: productCategoryProducts.timestamp,
          category: product_categories,
        })
        .from(productCategoryProducts)
        .innerJoin(
          product_categories,
          eq(productCategoryProducts.categoryId, product_categories.id),
        )
        .where(eq(productCategoryProducts.productId, productId))
        .orderBy(desc(productCategoryProducts.timestamp))

      return c.json({
        success: true,
        data: productCategoryRelations.map((relation) => relation.category),
        associations: productCategoryRelations,
      })
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500)
    }
  },
)

export default app
