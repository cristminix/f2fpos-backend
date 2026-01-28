import { API_BASE_URL } from "../config"
import { doFetchRequest } from "../fn/doFetchRequest"

export async function seedMember() {
  const data = [
    {
      fullName: "Member Test",
      email: "member@test.com",
      phoneNumber: "08123456789",
      password: "password", // Password akan di-hash di sisi server
      memberType: "OWNER",
      accountStatus: "active",
    },
  ]
  const userId = 1 // Asumsi user yang membuat adalah user dengan id 1
  for (const member of data) {
    try {
      const response = await doFetchRequest(`${API_BASE_URL}/MemberService`, {
        method: "POST",
        body: JSON.stringify({ userId, timestamp: Date.now(), ...member }),
      })

      const result: any = await response.json()

      if (response.ok) {
        console.log("Seed Member successful!", result)
        return result
      } else {
        console.error("Seed Error:", result.message || "Unknown error")
        return null
      }
    } catch (error) {
      console.error("Error during seed member request:", error)
      return null
    }
  }

  return data
}
