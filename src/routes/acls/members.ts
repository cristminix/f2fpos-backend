export const acls = {
  "/": [
    {
      role: "member.list",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "member.create",
      groups: ["group:admin"],
      method: "post",
    },
  ],
  "/:id": [
    {
      role: "member.read",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "member.update",
      groups: ["group:admin"],
      method: "put",
    },
    {
      role: "member.delete",
      groups: ["group:admin"],
      method: "delete",
    },
  ],
}
