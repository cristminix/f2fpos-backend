import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings";
import MIngredient from "../../global/models/MIngredient";

const ingredientCreateValidationSchema = z.object({
  name: z.string(),
  code: z.string(),
  outletId: z.number(),
});

const ingredientUpdateValidationSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  outletId: z.number().optional(),
});

const app = createHonoWithBindings();

// Get all ingredients
app.get("/", async (c) => {
  const mIngredient = new MIngredient(c);

  const { limit = 1000, page = 1, sortField, sortOrder } = c.req.query();

  // Build order object if sortField and sortOrder are provided
  let order = null;
  if (sortField && sortOrder) {
    // Validate sortField to ensure it's a valid field in the schema
    const validSortFields = ["id", "name", "code", "outletId", "timestamp"];
    if (validSortFields.includes(sortField)) {
      const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
      //@ts-ignore
      order = { [sortField]: direction };
    }
  }

  const result = await mIngredient.getList(
    Number(limit),
    Number(page),
    order, // Pass the order object to getList
  );

  return c.json(result);
});

// Get ingredient by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mIngredient = new MIngredient(c);
  const ingredient = await mIngredient.getRow(id);

  if (!ingredient) {
    return c.json({ success: false, message: "Ingredient not found" }, 404);
  }

  return c.json({ success: true, data: ingredient });
});

// Create new ingredient
app.post("/", zBodyValidator(ingredientCreateValidationSchema), async (c) => {
  const ingredientData = c.req.valid("form");

  const mIngredient = new MIngredient(c);
  console.log({ ingredientData });
  try {
    // Check if ingredient with this code already exists in the same outlet
    const existingIngredient = await mIngredient.getByCode(ingredientData.code);
    if (
      existingIngredient &&
      existingIngredient.outletId === ingredientData.outletId
    ) {
      return c.json(
        {
          success: false,
          message: "Ingredient with this code already exists in this outlet",
        },
        409,
      );
    }

    const [result] = await mIngredient.create(ingredientData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Update ingredient by ID
app.put("/:id", zBodyValidator(ingredientUpdateValidationSchema), async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const ingredientData = c.req.valid("form");

  const mIngredient = new MIngredient(c);

  // Check if ingredient exists
  const existingIngredient = await mIngredient.getRow(id);
  // console.log({ existingIngredient });

  if (!existingIngredient) {
    return c.json({ success: false, message: "Ingredient not found" }, 404);
  }

  try {
    delete ingredientData.outletId; // Prevent changing outlet ownership
    const [result] = await mIngredient.update(id, ingredientData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Delete ingredient by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mIngredient = new MIngredient(c);

  // Check if ingredient exists
  const existingIngredient = await mIngredient.getRow(id);
  if (!existingIngredient) {
    return c.json({ success: false, message: "Ingredient not found" }, 404);
  }

  try {
    const [result] = await mIngredient.delete(id, existingIngredient);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Get ingredients by outlet ID
app.get("/by-outlet/:outletId", async (c) => {
  const outletId = parseInt(c.req.param("outletId"));

  if (isNaN(outletId)) {
    return c.json({ success: false, message: "Invalid outlet ID" }, 400);
  }

  const mIngredient = new MIngredient(c);

  try {
    const ingredients = await mIngredient.getByOutletId(outletId);
    return c.json({ success: true, data: ingredients });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
