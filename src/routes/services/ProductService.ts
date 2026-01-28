import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { MProduct } from "../../global/models/MProduct"

const app = createHonoWithBindings()

app.get("/", async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "id",
    order = "asc",
    filters,
  } = c.req.query()
  const pageNumber = parseInt(page, 10)
  const limitNumber = parseInt(limit, 10)
  const parsedFilters = filters ? JSON.parse(filters) : {}

  const model = new MProduct(c)
  const data = await model.getList(
    limitNumber,
    pageNumber,
    { [sort]: order } as any,
    parsedFilters,
    null,
  )
  return c.json(data)
})

app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MProduct(c)
  const data = await model.getRow(parseInt(id, 10))
  return c.json(data)
})

app.post("/", async (c) => {
  const body = await c.req.json()
  const model = new MProduct(c)
  const data = await model.create(body)
  return c.json(data)
})

app.put("/:id", async (c) => {
  const id = c.req.param("id")
  const body = await c.req.json()
  const model = new MProduct(c)
  const data = await model.update(parseInt(id, 10), body)
  return c.json(data)
})

app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MProduct(c)
  const data = await model.delete(parseInt(id, 10), null)
  return c.json(data)
})

export { app as ProductService }
