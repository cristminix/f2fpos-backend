export const acls = {
  "/": [
    {
      role: "user.list",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "user.create",
      groups: ["group:admin"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "user.read",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "user.update",
      groups: ["group:admin"],
      method: "put",
    },
    {
      role: "user.delete",
      groups: ["group:admin"],
      method: "delete",
    },
  ],
}
