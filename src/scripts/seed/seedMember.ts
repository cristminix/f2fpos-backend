import { API_BASE_URL } from "../config"
import { doFetchRequest } from "../fn/doFetchRequest"

export async function seedMember() {
  const data = [
    {
      fullName: "Active Member",
      email: "active@test.com",
      phoneNumber: "08123456789",
      password: "password",
      memberType: "OWNER",
      accountStatus: "ACTIVE",
    },
    {
      fullName: "Inactive Member",
      email: "inactive@test.com",
      phoneNumber: "08123456780",
      password: "password",
      memberType: "DISTRIBUTOR",
      accountStatus: "INACTIVE",
    },
    {
      fullName: "Suspended Member",
      email: "suspended@test.com",
      phoneNumber: "08123456781",
      password: "password",
      memberType: "RESELLER",
      accountStatus: "SUSPENDED",
    },
    {
      fullName: "Waiting Changes Member",
      email: "waitingchanges@test.com",
      phoneNumber: "08123456782",
      password: "password",
      memberType: "OWNER",
      accountStatus: "WAITING_FOR_CHANGES",
    },
    {
      fullName: "Waiting Review Member",
      email: "waitingreview@test.com",
      phoneNumber: "08123456783",
      password: "password",
      memberType: "DISTRIBUTOR",
      accountStatus: "WAITING_FOR_REVIEW",
    },
  ]

  const results: any[] = []
  for (const member of data) {
    try {
      const response = await doFetchRequest(`${API_BASE_URL}/MemberService`, {
        method: "POST",
        body: JSON.stringify(member),
      })

      const result: any = await response.json()

      if (response.ok) {
        console.log(`Seed Member successful for ${member.email}!`, result)
        results.push(result)
      } else {
        console.error(
          `Seed Error for ${member.email}:`,
          result.message || "Unknown error",
        )
        results.push(null)
      }
    } catch (error) {
      console.error(
        `Error during seed member request for ${member.email}:`,
        error,
      )
      results.push(null)
    }
  }

  return results
}
