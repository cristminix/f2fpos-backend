export const acls = {
  "/": [
    {
      role: "product_images.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_images.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "product_images.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_images.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "product_images.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
  "/by-product/:productId": [
    {
      role: "product_images.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
  ],
}
