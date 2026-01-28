export const acls = {
  "/": [
    {
      role: "order.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "order.create",
      groups: ["group:admin", "group:member"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "order.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "order.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "order.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
