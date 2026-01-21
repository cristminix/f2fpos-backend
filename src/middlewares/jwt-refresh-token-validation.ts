import { verify } from "hono/jwt"
import { getCookie } from "hono/cookie"
import { bearerAuth } from "hono/bearer-auth"

export const validateRefreshToken = async (c, next) => {
  let message = ""

  const bearer = bearerAuth({
    verifyToken: async (token, c) => {
      // console.log(token)
      let verified = false
      try {
        const payload = await verify(token, c.env.JWT_SECRET, "HS256")
        verified = !!payload
      } catch (e) {
        verified = false
        console.error("Token verification failed:", token, e)

        // Check if the error indicates an expired token
        const errorMessage = e instanceof Error ? e.toString() : "Unknown error"
        console.log({ errorMessage })
        if (
          errorMessage &&
          typeof errorMessage === "string" &&
          (errorMessage.toLowerCase().includes("exp") ||
            errorMessage.toLowerCase().includes("expired"))
        ) {
          throw new Error("Token Expired")
        }
      }
      return verified
    },
  })
  let result

  try {
    result = await bearer(c, next)
  } catch (e) {
    message = e instanceof Error ? e.toString() : "Unknown error"
    if (
      message &&
      typeof message === "string" &&
      message.toLowerCase().match(/expired/)
    )
      message = "Token Expired"
    else message = "Unauthorized"
    // console.error(e)
  }

  console.log(result, message)
  if (result) return result

  return c.json(
    {
      success: false,
      message,
    },
    401,
  )
}
