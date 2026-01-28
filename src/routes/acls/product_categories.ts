export const acls = {
  "/": [
    {
      role: "product_category.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_category.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "product_category.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product_category.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "product_category.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
