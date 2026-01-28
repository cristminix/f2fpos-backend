export const acls = {
  "/": [
    {
      role: "product_stock.list",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "product_stock.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "product_stock.read",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "product_stock.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "product_stock.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
