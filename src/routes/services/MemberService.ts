import { Hono } from "hono"
import { MMember } from "../../global/models/MMember"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { encryptPassword } from "../../global/fn/encryptPassword"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"

const app = createHonoWithBindings()

const createMemberSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  password: z.string(),
  memberType: z.string().optional(),
  accountStatus: z.string().optional(),
})

// List
app.get("/", async (c) => {
  const model = new MMember(c)
  const {
    limit: limitStr,
    page: pageStr,
    order: orderStr,
    filter: filterStr,
    search: searchStr,
  } = c.req.query()

  const safeJsonParse = (str: string | undefined) => {
    if (!str) return undefined
    try {
      return JSON.parse(str)
    } catch (e) {
      return undefined
    }
  }

  const limit = limitStr ? parseInt(limitStr, 10) : undefined
  const page = pageStr ? parseInt(pageStr, 10) : undefined
  const order = safeJsonParse(orderStr)
  const filter = safeJsonParse(filterStr)
  const search = safeJsonParse(searchStr)

  const data = await model.getList(limit, page, order, filter, search)
  return c.json(data)
})

// Get by ID
app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MMember(c)
  const data = await model.getRow(id)
  return c.json(data)
})

// Create
app.post("/", async (c) => {
  const body = await c.req.json()
  const validation = createMemberSchema.safeParse(body)
  if (!validation.success) {
    return c.json({ success: false, message: "Invalid input" }, 400)
  }
  //
  const model = new MMember(c)

  // Check if email is already in use
  const existingMember = await model.getRow({ email: validation.data.email })
  if (existingMember) {
    return c.json({ success: false, message: "Email already in use" }, 409)
  }

  const { password, ...rest } = validation.data
  const passwordHash = await encryptPassword(password, c.env.JWT_SECRET)
  const [data] = await model.create({
    ...rest,
    passwordHash,
  })
  return c.json(
    { success: true, message: "Member created successfully", data },
    201,
  )
})

// Update
app.put("/:id", async (c) => {
  const id = c.req.param("id")
  const body = await c.req.json()
  const model = new MMember(c)
  const result = await model.update(id, body)
  return c.json(result)
})

// Delete
app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MMember(c)
  const result = await model.delete(id, undefined)
  return c.json(result)
})

export default app
