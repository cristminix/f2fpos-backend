/**
 * Checks if a given path is in the Access Control List (ACL) for a specific method
 * @param {string} path - The path to check in the ACL
 * @param {Object} acls - The ACL object containing path-based permissions
 * @param {string} [preferedMethod="get"] - The HTTP method to check permissions for (defaults to "get")
 * @returns {Array} - Returns an array of ACL entries (groups and role) if the path and method match, otherwise returns an empty array
 *
 * @description
 * This function checks if a specific path exists in the provided ACL object and if the requested method matches the allowed method.
 * If both conditions are met, it returns an array containing the groups and role associated with that path.
 * If the path doesn't exist in ACLs, it creates a default ACL entry with undefined role, empty groups array, and "get" method.
 * If no method is specified in the ACL entry, it defaults to "get".
 */
export const isInAcl = (path, acls, preferedMethod = "get") => {
  // Parse ACL entry for the given path, or create a default entry if path doesn't exist
  let parsedAcl =
    typeof acls === "object" && path in acls
      ? acls[path]
      : { role: undefined, groups: [], method: "get" }
  // console.log({ parsedAcl, path })
  if (Array.isArray(parsedAcl)) {
    const [newParsedAcl] = parsedAcl.filter((a) => a.method === preferedMethod)
    if (newParsedAcl) {
      parsedAcl = newParsedAcl
    }
  }
  // Set default method to "get" if not specified in the ACL entry
  if (!parsedAcl.method) {
    parsedAcl.method = "get"
  }

  // Extract role, groups, and method from the parsed ACL entry
  const { role: aclName, groups: aclInGroups, method } = parsedAcl

  // Check if the preferred method matches the allowed method in ACL
  if (preferedMethod === method) {
    // Combine groups and role into a single array and return
    const aclLists = [...aclInGroups, aclName]
    return aclLists
  }

  // Return empty array if methods don't match
  return []
}
