import { API_BASE_URL } from "../config"

// Function to send POST login request to /api/LoginService/login
export const sendLoginRequest = async (loginData: {
  email: string
  password: string
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/LoginService/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })

    const result: any = await response.json()
    // console.log("Login Response:", result)

    if (response.ok) {
      // console.log("Login successful!")
      return result
    } else {
      console.error("Login failed:", result.message || "Unknown error")
      return null
    }
  } catch (error) {
    console.error("Error during login request:", error)
    return null
  }
}
