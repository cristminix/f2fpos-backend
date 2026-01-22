import { drizzle } from "drizzle-orm/d1"
import { and, eq } from "drizzle-orm"
import { sign } from "hono/jwt"
import { setCookie, getCookie, deleteCookie } from "hono/cookie"
import { z } from "zod"
import { zBodyValidator } from "@hono-dev/zod-body-validator"
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings"
import { encryptPassword } from "../../global/fn/encryptPassword"
import { generateAccessToken } from "../../global/fn/generateAccessToken"
import { generateRefreshToken } from "../../global/fn/generateRefreshToken"
// import { randomBytes, createHash } from "node:crypto"
import { users } from "../../db/schema"
import { validateRefreshToken } from "../../middlewares/jwt-refresh-token-validation"
// import {validateAccessToken} from "../middlewares/jwt-validation-api"
import MUser from "../../global/models/MUser"
import MUserRole from "../../global/models/MUserRole"

const registerValidationSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
})

const loginValidationSchema = z.object({
  //   devId: z.string(),
  //   ipaddr: z.string(),
  password: z.string(),
  email: z.string().email(),
})

// const refreshTokenValidationSchema = z.object({
//   refreshToken: z.string(),
// })

const app = createHonoWithBindings()

app.post(
  "/refresh",
  async (c, next) => await validateRefreshToken(c, next),
  async (c) => {
    //@ts-ignore
    const { uid } = c.req.json()
    const { token: accessToken } = await generateAccessToken(
      c.env.JWT_SECRET,
      uid,
      c.env.TOKEN_EXPIRATION,
    )
    const { token: refreshToken } = await generateRefreshToken(
      c.env.JWT_SECRET,
      uid,
      c.env.REFRESH_TOKEN_EXPIRATION,
    )
    return c.json({
      accessToken,
      refreshToken,
    })
  },
)
app.post("/login", zBodyValidator(loginValidationSchema), async (c) => {
  const user = c.req.valid("form")

  const { email, password } = user
  const mUser = new MUser(c)
  const mUserRole = new MUserRole(c)

  let userRow = await mUser.getRow({ email })

  if (!userRow) {
    return c.json({ success: false, message: "User not found" }, 404)
  }

  const encryptedPassword = await encryptPassword(password, c.env.JWT_SECRET)
  console.log({ encryptedPassword })
  const isPasswordMatched = userRow?.password === encryptedPassword

  if (!isPasswordMatched) {
    return c.json({ success: false, message: "Wrong password" }, 404)
  }
  const userRoles = await mUserRole.getRow({ userId: userRow.id })
  let roles: any = {}
  const token = await generateAccessToken(
    c.env.JWT_SECRET,
    userRow.id,

    c.env.TOKEN_EXPIRATION,
    roles,
  )

  const refreshToken = await generateRefreshToken(
    c.env.JWT_SECRET,
    userRow.id,
    c.env.REFRESH_TOKEN_EXPIRATION,
  )

  try {
    roles = JSON.parse(userRoles.roles)
  } catch (error) {}
  return c.json({
    success: true,
    message: "login success",
    accessToken: token.token,
    refreshToken: refreshToken.token,
    roles,
    user: {
      username: userRow.username,
      email: userRow.email,
      id: userRow.id,
    },
  })
})
export default app
