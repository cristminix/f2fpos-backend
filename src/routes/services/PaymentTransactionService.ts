import { MPaymentTransaction } from "../../global/models/MPaymentTransaction"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"

const app = createHonoWithBindings()

// GET / - List all payment transactions
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
  const parsedFilters = filters ? JSON.parse(filters) : undefined

  const model = new MPaymentTransaction(c)
  const data = await model.getList(
    limitNumber,
    pageNumber,
    { [sort]: order } as any,
    parsedFilters,
    null,
  )
  return c.json(data)
})

// GET /:id - Get a single payment transaction
app.get("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MPaymentTransaction(c)
  const data = await model.getRow(id)
  if (!data) {
    return c.json({ message: "Payment transaction not found" }, 404)
  }
  return c.json(data)
})

// POST / - Create a new payment transaction
app.post("/", async (c) => {
  const body = await c.req.json()
  const model = new MPaymentTransaction(c)
  const data = await model.create(body)
  return c.json(data, 201)
})

// PUT /:id - Update an existing payment transaction
app.put("/:id", async (c) => {
  const id = c.req.param("id")
  const body = await c.req.json()
  const model = new MPaymentTransaction(c)
  const data = await model.update(id, body)
  if (!data) {
    return c.json({ message: "Payment transaction not found" }, 404)
  }
  return c.json(data)
})

// DELETE /:id - Delete a payment transaction
app.delete("/:id", async (c) => {
  const id = c.req.param("id")
  const model = new MPaymentTransaction(c)
  const success = await model.delete(id, null)
  if (!success) {
    return c.json(
      { message: "Payment transaction not found or could not be deleted" },
      404,
    )
  }
  return c.json({ message: "Payment transaction deleted successfully" })
})

export const PaymentTransactionService = app
