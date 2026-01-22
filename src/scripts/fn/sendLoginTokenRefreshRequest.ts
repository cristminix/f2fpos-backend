import { API_BASE_URL } from "../config"

// Function to send POST login request to /api/LoginService/login
export const sendLoginTokenRefreshRequest = async (refreshToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/LoginService/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      // body: JSON.stringify(loginData),
    })

    const result: any = await response.json()
    // console.log("Login Response:", result)

    if (response.ok) {
      // console.log("Login successful!")
      return result
    } else {
      console.error("Token refresh failed:", result.message || "Unknown error")
      return null
    }
  } catch (error) {
    console.error("Error during update token request:", error)
    return null
  }
}
