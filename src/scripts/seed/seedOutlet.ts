import { API_BASE_URL } from "../config"
import { doFetchRequest } from "../fn/doFetchRequest"

export async function seedOutlet() {
  const data = [
    {
      name: "F2F Mart",
      address: "Jln Kehidupan No. 666",
      businessType: "retail",
      logo: "no-logo",
      tax: 0,
      settings: `{"enablePayment":false}`,
    },
  ]
  const userId = 1
  for (const outlet of data) {
    try {
      const response = await doFetchRequest(`${API_BASE_URL}/OutletService`, {
        method: "POST",

        body: JSON.stringify({ userId, timestamp: Date.now(), ...outlet }),
      })

      const result: any = await response.json()
      // console.log("Login Response:", result)

      if (response.ok) {
        // console.log("Login successful!")
        return result
      } else {
        console.error("Seed Error:", result.message || "Unknown error")
        return null
      }
    } catch (error) {
      console.error("Error during update token request:", error)
      return null
    }
  }

  return data
}
