export const isInAcl = (path, acls, preferedMethod = "get") => {
  const parsedAcl =
    typeof acls === "object" && path in acls
      ? acls[path]
      : { role: undefined, groups: [], method: "get" }
  if (!parsedAcl.method) {
    parsedAcl.method = "get"
  }
  const { role: aclName, groups: aclInGroups, method } = parsedAcl
  // console.log({ preferedMethod, method })
  if (preferedMethod === method) {
    const aclLists = [...aclInGroups, aclName]
    return aclLists
  }
  return []
}
