import { verify } from "hono/jwt"
import { getCookie } from "hono/cookie"
import { bearerAuth } from "hono/bearer-auth"

export const validateUserRoles = async (c, next, acls) => {
  const { roles } = c.get("jwt")
  if (Array.isArray(roles)) {
    if (acls.some((role) => roles.includes(role))) {
      return next()
    }
  }
  return c.json({
    success: false,
    message: "invalid user roles",
  })
}
