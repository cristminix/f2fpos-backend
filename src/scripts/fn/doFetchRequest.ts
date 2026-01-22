import { loginData } from "../config"
import { getAccessToken } from "./getAccessToken"

export async function doFetchRequest(url: string, options: any = {}) {
  const accessToken = await getAccessToken(loginData)
  const fetchOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  }
  return await fetch(url, fetchOptions)
}
