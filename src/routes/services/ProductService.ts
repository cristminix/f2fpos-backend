import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings";
import { MProduct } from "../../global/models/MProduct";

const productCreateValidationSchema = z.object({
  outletId: z.number(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  unit: z.string(),
  alternateUnit: z.string(),
  image: z.string().optional(),
});

const productUpdateValidationSchema = z.object({
  outletId: z.number().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  alternateUnit: z.string().optional(),
  image: z.string().optional(),
});

const app = createHonoWithBindings();

// Get all products
app.get("/", async (c) => {
  const mProduct = new MProduct(c);

  const { limit = 1000, page = 1, sortField, sortOrder } = c.req.query();

  // Build order object if sortField and sortOrder are provided
  let order = null;
  if (sortField && sortOrder) {
    // Validate sortField to ensure it's a valid field in the schema
    const validSortFields = [
      "id",
      "name",
      "code",
      "outletId",
      "unit",
      "alternateUnit",
      "timestamp",
    ];
    if (validSortFields.includes(sortField)) {
      const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
      //@ts-ignore
      order = { [sortField]: direction };
    }
  }

  const result = await mProduct.getList(
    Number(limit),
    Number(page),
    order, // Pass the order object to getList
  );

  return c.json(result);
});

// Get product by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mProduct = new MProduct(c);
  const product = await mProduct.getRow(id);

  if (!product) {
    return c.json({ success: false, message: "Product not found" }, 404);
  }

  return c.json({ success: true, data: product });
});

// Create new product
app.post("/", zBodyValidator(productCreateValidationSchema), async (c) => {
  const productData = c.req.valid("form");

  const mProduct = new MProduct(c);
  console.log({ productData });
  try {
    // Check if product with this name and outlet combination already exists
    const existingProduct = await mProduct.getByNameAndOutletId(
      productData.name,
      productData.outletId,
    );

    if (existingProduct) {
      return c.json(
        {
          success: false,
          message: "Product with this name already exists in this outlet",
        },
        409,
      );
    }

    // Check if product with this code and outlet combination already exists
    const existingProductByCode = await mProduct.getByCodeAndOutletId(
      productData.code,
      productData.outletId,
    );

    if (existingProductByCode) {
      return c.json(
        {
          success: false,
          message: "Product with this code already exists in this outlet",
        },
        409,
      );
    }

    const [result] = await mProduct.create(productData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Update product by ID
app.put("/:id", zBodyValidator(productUpdateValidationSchema), async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const productData = c.req.valid("form");

  const mProduct = new MProduct(c);

  // Check if product exists
  const existingProduct = await mProduct.getRow(id);

  if (!existingProduct) {
    return c.json({ success: false, message: "Product not found" }, 404);
  }

  try {
    // Prevent changing outletId
    delete productData.outletId;

    // Check if updating name to a value that already exists for this outlet
    if (productData.name && productData.name !== existingProduct.name) {
      const existingProductWithName = await mProduct.getByNameAndOutletId(
        productData.name,
        existingProduct.outletId,
      );

      if (existingProductWithName) {
        return c.json(
          {
            success: false,
            message: "Product with this name already exists in this outlet",
          },
          409,
        );
      }
    }

    // Check if updating code to a value that already exists for this outlet
    if (productData.code && productData.code !== existingProduct.code) {
      const existingProductWithCode = await mProduct.getByCodeAndOutletId(
        productData.code,
        existingProduct.outletId,
      );

      if (existingProductWithCode) {
        return c.json(
          {
            success: false,
            message: "Product with this code already exists in this outlet",
          },
          409,
        );
      }
    }

    const [result] = await mProduct.update(id, productData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Delete product by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mProduct = new MProduct(c);

  // Check if product exists
  const existingProduct = await mProduct.getRow(id);
  if (!existingProduct) {
    return c.json({ success: false, message: "Product not found" }, 404);
  }

  try {
    const [result] = await mProduct.delete(id, existingProduct);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
