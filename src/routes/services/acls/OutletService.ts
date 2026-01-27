export const acls = {
  "/": [
    {
      role: "outlet.list",
      groups: ["group:admin", "group:owner"],
      method: "get",
    },
    {
      role: "outlet.create",
      groups: ["group:admin", "group:owner"],
      method: "post",
    },
  ],
}
