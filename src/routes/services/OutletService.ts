import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { outlets } from "../../db/schema"
import MOutlet from "../../global/models/MOutlet"

const outletCreateValidationSchema = z.object({
  userId: z.number(),
  name: z.string(),
  address: z.string(),
  businessType: z.string(),
  logo: z.string().optional(),
  tax: z.number().optional(),
  settings: z.string().optional(),
})

const outletUpdateValidationSchema = z.object({
  userId: z.number().optional(),
  name: z.string().optional(),
  address: z.string().optional(),
  businessType: z.string().optional(),
  logo: z.string().optional(),
  tax: z.number().optional(),
  settings: z.string().optional(),
})

const app = createHonoWithBindings()

// Get all outlets
app.get("/", async (c) => {
  const mOutlet = new MOutlet(c)

  const { limit = 10, page = 1 } = c.req.query()

  const result = await mOutlet.getList(Number(limit), Number(page))

  return c.json(result)
})

// Get outlet by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"))

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400)
  }

  const mOutlet = new MOutlet(c)
  const outlet = await mOutlet.getRow(id)

  if (!outlet) {
    return c.json({ success: false, message: "Outlet not found" }, 404)
  }

  return c.json({ success: true, data: outlet })
})

// Create new outlet
app.post("/", zBodyValidator(outletCreateValidationSchema), async (c) => {
  const outletData = c.req.valid("form")
  console.log({ outletData })
  const mOutlet = new MOutlet(c)

  try {
    const result = await mOutlet.create(outletData)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Update outlet by ID
app.put("/:id", zBodyValidator(outletUpdateValidationSchema), async (c) => {
  const id = parseInt(c.req.param("id"))

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400)
  }

  const outletData = c.req.valid("form")

  const mOutlet = new MOutlet(c)

  // Check if outlet exists
  const existingOutlet = await mOutlet.getRow(id)
  if (!existingOutlet) {
    return c.json({ success: false, message: "Outlet not found" }, 404)
  }

  try {
    const result = await mOutlet.update(id, outletData)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Delete outlet by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"))

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400)
  }

  const mOutlet = new MOutlet(c)

  // Check if outlet exists
  const existingOutlet = await mOutlet.getRow(id)
  if (!existingOutlet) {
    return c.json({ success: false, message: "Outlet not found" }, 404)
  }

  try {
    const result = await mOutlet.delete(id, existingOutlet)
    return c.json({ success: true, data: result })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

// Get outlets by user ID
app.get("/by-user/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"))

  if (isNaN(userId)) {
    return c.json({ success: false, message: "Invalid user ID" }, 400)
  }

  const mOutlet = new MOutlet(c)

  try {
    const outlets = await mOutlet.getOutletsByUserId(userId)
    return c.json({ success: true, data: outlets })
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500)
  }
})

export default app
