import { API_BASE_URL } from "../config";
import { doFetchRequest } from "../fn/doFetchRequest";

export async function fetchProductCategory() {
  try {
    const response = await doFetchRequest(`${API_BASE_URL}/OutletService`, {
      method: "GET",

      // body: JSON.stringify({ userId, timestamp: Date.now(), ...outlet }),
    });

    const result: any = await response.json();
    console.log({ result });

    if (response.ok) {
      return result;
    } else {
      console.error("Error:", result.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Error during  request:", error);
    return null;
  }
}
