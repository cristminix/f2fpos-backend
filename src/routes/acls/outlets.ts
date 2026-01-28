export const acls = {
  "/": [
    {
      role: "outlet.list",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "outlet.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "outlet.read",
      groups: ["group:admin", "group:owner", "group:member"],
      method: "get",
    },
    {
      role: "outlet.update",
      groups: ["group:admin", "group:owner"],
      method: "put",
    },
    {
      role: "outlet.delete",
      groups: ["group:admin", "group:owner"],
      method: "delete",
    },
  ],
}
