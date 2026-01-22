import { API_BASE_URL } from "../config";
import { doFetchRequest } from "../fn/doFetchRequest";

export async function seedUser() {
  const userData = [
    {
      username: "demo",
      email: "demo@example.com",
      password: "password",
      roles: ["group:owner"],
      displayName: "Lalisa Mano",
      avatar:
        "https://i.pinimg.com/736x/c0/5b/a5/c05ba59a93d4e7ca51cafd2575a21b84.jpg",
    },
    {
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      roles: ["group:admin"],
      displayName: "John Lenon",
      avatar: "https://i1.sndcdn.com/artworks-000062209624-mvitec-t500x500.jpg",
    },
  ];

  for (const user of userData) {
    try {
      const response = await doFetchRequest(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(user),
      });

      const result: any = await response.json();

      if (response.ok) {
        console.log(`User created successfully: ${user.username}`);
      } else {
        console.error(
          `Seed Error for ${user.username}:`,
          result.message || "Unknown error",
        );
      }
    } catch (error) {
      console.error(`Error during seeding user ${user.username}:`, error);
    }
  }

  return userData;
}
