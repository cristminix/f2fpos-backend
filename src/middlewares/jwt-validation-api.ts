import { verify } from "hono/jwt"
// import { getCookie } from "hono/cookie"
// import { createHash } from "node:crypto"
import { bearerAuth } from "hono/bearer-auth"

export function applyJwtValidationApi(app) {
  app.use("/api/*", async (c, next) => {
    // Exclude LoginService routes from JWT validation
    const path = c.req.path
    if (path.startsWith("/api/LoginService/")) {
      return next()
    }

    let message = ""
    const bearer = bearerAuth({
      verifyToken: async (token, c) => {
        try {
          const decodedToken = await verify(token, c.env.JWT_SECRET, "HS256")
          console.log({ decodedToken })
          c.set("jwt", decodedToken)
          return !!decodedToken
        } catch (e) {
          console.error("Token verification failed:", token, e)

          // Check if the error indicates an expired token
          const errorMessage =
            e instanceof Error ? e.toString() : "Unknown error"
          console.log({ errorMessage })
          if (
            errorMessage &&
            typeof errorMessage === "string" &&
            (errorMessage.toLowerCase().includes("exp") ||
              errorMessage.toLowerCase().includes("expired"))
          ) {
            throw new Error("Token Expired")
          }

          return false
        }
      },
    })
    let result
    try {
      result = await bearer(c, next)
    } catch (e) {
      message = e instanceof Error ? e.message : "Unknown error"
      if (
        message &&
        typeof message === "string" &&
        message.toLowerCase().includes("expired")
      )
        message = "Token Expired"
      else message = "Unauthorized"
      // console.error({ e })
    }
    console.log({ result, message })
    if (result) return result
    return c.json(
      {
        success: false,
        message,
      },
      401,
    )
  })
}
