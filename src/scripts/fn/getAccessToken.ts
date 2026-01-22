import { JSON_CRED_PATH } from "../config"
import { loadJson, saveJson } from "./jsonUtils"
import { sendLoginRequest } from "./sendLoginRequest"
import { sendLoginTokenRefreshRequest } from "./sendLoginTokenRefreshRequest"

export const getAccessToken = async (loginData: any) => {
  let credential: any
  try {
    credential = await loadJson(JSON_CRED_PATH)
  } catch (error) {}

  if (!credential) {
    credential = await sendLoginRequest(loginData)
    await saveJson(JSON_CRED_PATH, credential)
  }
  let { accessToken, refreshToken } = credential
  // Fungsi untuk mendekode payload JWT tanpa verifikasi signature
  const decodeJWT = (token: string) => {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("Invalid JWT token format")
      }

      // Decode payload (bagian tengah dari JWT)
      const payload = parts[1]
      // Tambahkan padding jika diperlukan
      const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4)
      const decodedPayload = atob(paddedPayload)
      return JSON.parse(decodedPayload)
    } catch (error) {
      console.error("Error decoding JWT:", error)
      return null
    }
  }

  const isExpired = () => {
    if (!accessToken) {
      return true // Token tidak ada dianggap expired
    }

    const decodedPayload = decodeJWT(accessToken)
    if (!decodedPayload || !decodedPayload.exp) {
      return true // Jika tidak bisa decode atau tidak ada klaim exp, anggap expired
    }

    // Bandingkan waktu expiry (dalam detik) dengan waktu saat ini (dalam detik)
    const currentTime = Math.floor(Date.now() / 1000)
    return decodedPayload.exp < currentTime
  }

  // Return token jika tidak expired, jika tidak kembalikan null atau lakukan refresh
  if (!isExpired()) {
    return accessToken
  } else {
    const { accessToken, refreshToken: newRefreshToken } =
      await sendLoginTokenRefreshRequest(refreshToken)
    credential.accessToken = accessToken
    credential.refreshToken = newRefreshToken
    await saveJson(JSON_CRED_PATH, credential)
    console.log({ credential })
  }

  return credential.accessToken
}
