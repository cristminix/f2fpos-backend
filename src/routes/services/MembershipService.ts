import { Hono } from "hono"
import { MMembership } from "../../global/models/MMembership"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"

const app = createHonoWithBindings()

// List
app.get("/", async (c) => {
  const model = new MMembership(c)
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
  const model = new MMembership(c)
  const data = await model.getRow(id)
  return c.json(data)
})

// Create
app.post("/", async (c) => {
  const body = await c.req.json()
  const model = new MMembership(c)
  const result = await model.create(body)
  return c.json(result, 201)
})

// Update
app.put("/:id", async (c) => {
  const id = c.req.param("id")
  const body = await c.req.json()
  const model = new MMembership(c)
  const result = await model.update(id, body)
  return c.json(result)
})

// Delete
app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MMembership(c)
  const result = await model.delete(id, undefined)
  return c.json(result)
})

export default app
