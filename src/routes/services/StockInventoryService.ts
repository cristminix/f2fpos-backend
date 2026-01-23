import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings";
import { stock_inventory } from "../../db/schema";
import { MStockInventory } from "../../global/models/MStockInventory";

const stockInventoryCreateValidationSchema = z.object({
  outletId: z.number(),
  itemId: z.number(),
  itemType: z.string(),
  minQty: z.number().optional().default(0),
  qty: z.number().optional().default(0),
  notes: z.string().optional(),
});

const stockInventoryUpdateValidationSchema = z.object({
  outletId: z.number().optional(),
  itemId: z.number().optional(),
  itemType: z.string().optional(),
  minQty: z.number().optional(),
  qty: z.number().optional(),
  notes: z.string().optional(),
});

const app = createHonoWithBindings();

// Get all stock inventories
app.get("/", async (c) => {
  const mStockInventory = new MStockInventory(c);

  const { limit = 1000, page = 1, sortField, sortOrder } = c.req.query();

  // Build order object if sortField and sortOrder are provided
  let order = null;
  if (sortField && sortOrder) {
    // Validate sortField to ensure it's a valid field in the schema
    const validSortFields = [
      "id",
      "outletId",
      "itemId",
      "itemType",
      "minQty",
      "qty",
      "timestamp",
    ];
    if (validSortFields.includes(sortField)) {
      const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
      //@ts-ignore
      order = { [sortField]: direction };
    }
  }

  const result = await mStockInventory.getList(
    Number(limit),
    Number(page),
    order, // Pass the order object to getList
  );

  return c.json(result);
});

// Get stock inventory by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mStockInventory = new MStockInventory(c);
  const stockInventory = await mStockInventory.getRow(id);

  if (!stockInventory) {
    return c.json(
      { success: false, message: "Stock inventory not found" },
      404,
    );
  }

  return c.json({ success: true, data: stockInventory });
});

// Create new stock inventory
app.post(
  "/",
  zBodyValidator(stockInventoryCreateValidationSchema),
  async (c) => {
    const stockInventoryData = c.req.valid("form");

    const mStockInventory = new MStockInventory(c);
    console.log({ stockInventoryData });
    try {
      // Check if stock inventory with this outletId, itemId and itemType combination already exists
      const existingStockInventory =
        await mStockInventory.getByOutletItemAndType(
          stockInventoryData.outletId,
          stockInventoryData.itemId,
          stockInventoryData.itemType,
        );

      if (existingStockInventory) {
        return c.json(
          {
            success: false,
            message:
              "Stock inventory with this outlet, item, and type combination already exists",
          },
          409,
        );
      }

      const [result] = await mStockInventory.create(stockInventoryData);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  },
);

// Update stock inventory by ID
app.put(
  "/:id",
  zBodyValidator(stockInventoryUpdateValidationSchema),
  async (c) => {
    const id = parseInt(c.req.param("id"));

    if (isNaN(id)) {
      return c.json({ success: false, message: "Invalid ID" }, 400);
    }

    const stockInventoryData = c.req.valid("form");

    const mStockInventory = new MStockInventory(c);

    // Check if stock inventory exists
    const existingStockInventory = await mStockInventory.getRow(id);

    if (!existingStockInventory) {
      return c.json(
        { success: false, message: "Stock inventory not found" },
        404,
      );
    }

    try {
      // Prevent changing outletId, itemId, and itemType (the unique combination)
      delete stockInventoryData.outletId;
      delete stockInventoryData.itemId;
      delete stockInventoryData.itemType;

      const [result] = await mStockInventory.update(id, stockInventoryData);
      return c.json({ success: true, data: result });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  },
);

// Delete stock inventory by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mStockInventory = new MStockInventory(c);

  // Check if stock inventory exists
  const existingStockInventory = await mStockInventory.getRow(id);
  if (!existingStockInventory) {
    return c.json(
      { success: false, message: "Stock inventory not found" },
      404,
    );
  }

  try {
    const [result] = await mStockInventory.delete(id, existingStockInventory);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
