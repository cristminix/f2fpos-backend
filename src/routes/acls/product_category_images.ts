export const acls = {
  "/": [
    {
      role: "product_category_images.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_category_images.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "product_category_images.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_category_images.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "product_category_images.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
  "/by-product-category/:productCategoryId": [
    {
      role: "product_category_images.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
  ],
}
