export const acls = {
  "/": [
    {
      role: "order_item.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "order_item.create",
      groups: ["group:admin", "group:member"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "order_item.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "order_item.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "order_item.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
