import { API_BASE_URL } from "../config"
import { doFetchRequest } from "../fn/doFetchRequest"

export async function seedProductCategory() {
  const data = [
    { name: "Elektronik" },
    { name: "Pakaian" },
    { name: "Makanan & Minuman" },
    { name: "Kesehatan & Kecantikan" },
    { name: "Otomotif" },
    { name: "Rumah Tangga" },
    { name: "Olahraga" },
    { name: "Buku & Alat Tulis" },
    { name: "Mainan & Hobi" },
    { name: "Perhiasan & Aksesori" },
  ]
  const outletId = 1
  for (const category of data) {
    try {
      const response = await doFetchRequest(
        `${API_BASE_URL}/ProductCategoryService`,
        {
          method: "POST",
          body: JSON.stringify({
            outletId,
            timestamp: Date.now(),
            ...category,
          }),
        },
      )

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
