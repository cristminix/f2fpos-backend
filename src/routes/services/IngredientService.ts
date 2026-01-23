import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings";
import MIngredient from "../../global/models/MIngredient";
import { MStockInventory } from "../../global/models/MStockInventory";

const ingredientCreateValidationSchema = z.object({
  name: z.string(),
  code: z.string(),
  outletId: z.number(),
  description: z.string().optional().default(""),
  unit: z.string().optional().default(""),
  alternateUnit: z.string().optional().default(""),
  qty: z.number().optional().default(0),
  minQty: z.number().optional().default(0),
});

const ingredientUpdateValidationSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  outletId: z.number().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  alternateUnit: z.string().optional(),
  qty: z.number().optional(),
  minQty: z.number().optional(),
});

const app = createHonoWithBindings();

// Get all ingredients
app.get("/", async (c) => {
  const mIngredient = new MIngredient(c);

  const {
    limit = 10,
    page = 1,
    sortField,
    sortOrder,
    outletId,
  } = c.req.query();

  // Build order object if sortField and sortOrder are provided
  let order = null;
  if (sortField && sortOrder) {
    // Validate sortField to ensure it's a valid field in the schema
    const validSortFields = [
      "id",
      "name",
      "code",
      "outletId",
      "timestamp",
      "qty",
      "minQty",
      "unit",
      "alternateUnit",
    ];
    if (validSortFields.includes(sortField)) {
      const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
      //@ts-ignore
      order = { [sortField]: direction };
    }
  }

  const result = await mIngredient.getListWithStock(
    //@ts-ignore
    outletId,

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
  const ingredientFormData = c.req.valid("form");
  const {
    name,
    code,
    outletId,
    unit,
    alternateUnit,
    description,
    qty,
    minQty,
  } = ingredientFormData;
  const ingredientData = {
    name,
    code,
    outletId,
    unit,
    alternateUnit,
    description,
    timestamp: Date.now(),
  };
  const mIngredient = new MIngredient(c);
  console.log({ ingredientData });
  let existingIngredient;

  try {
    let fieldCheck = "name";
    if (ingredientData.name.length > 0) {
      // Check if ingredient with this code already exists in the same outlet
      existingIngredient = await mIngredient.getByNameAndOutletId(
        ingredientData.name,
        ingredientData.outletId,
      );
    }
    if (ingredientData.code.length > 0) {
      fieldCheck = "code";
      // Check if ingredient with this code already exists in the same outlet
      existingIngredient = await mIngredient.getByCodeAndOutletId(
        ingredientData.code,
        ingredientData.outletId,
      );
    }
    if (
      existingIngredient &&
      existingIngredient.outletId === ingredientData.outletId
    ) {
      return c.json(
        {
          success: false,
          message: `Bahan baku dengan ${fieldCheck === "name" ? "nama" : "kode"} ${fieldCheck === "name" ? name : code} sudah ada untuk outlet ini.`, // "Ingredient with this code already exists in this outlet",
        },
        409,
      );
    }

    let [ingredientRow] = await mIngredient.create(ingredientData);
    if (ingredientRow) {
      const mStockInventory = new MStockInventory(c);
      const [inventory] = await mStockInventory.create({
        itemType: "ingredient",
        itemId: ingredientRow.id,
        outletId,
        qty,
        minQty,
        notes: "",
        timestamp: Date.now(),
      });
      ingredientRow = {
        ...ingredientRow,
        qty: inventory.qty,
        minQty: inventory.minQty,
      };
    }
    return c.json({ success: true, data: ingredientRow });
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
