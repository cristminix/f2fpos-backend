export const acls = {
  "/": [
    {
      role: "product.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "product.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "product.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "product.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
