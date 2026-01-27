export const acls = {
  "/": {
    role: "outlet.list",
    groups: ["group:admin", "group:owner"],
    method: "get",
  },
}
