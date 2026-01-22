//@ts-ignore
import * as fs from "fs/promises"
//@ts-ignore
import path from "path"

/**
 * Loads JSON data from a file
 * @param filePath Path to the JSON file
 * @returns Parsed JSON data or null if file doesn't exist or is invalid
 */
export const loadJson = async <T = any>(
  filePath: string,
): Promise<T | null> => {
  try {
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data) as T
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`File not found: ${filePath}`)
      return null
    }
    console.error(`Error reading JSON file ${filePath}:`, error)
    return null
  }
}

/**
 * Saves JSON data to a file
 * @param filePath Path where to save the JSON file
 * @param data Data to save as JSON
 * @returns Boolean indicating success or failure
 */
export const saveJson = async (
  filePath: string,
  data: any,
): Promise<boolean> => {
  try {
    // Ensure directory exists
    const dirPath = path.dirname(filePath)
    await fs.mkdir(dirPath, { recursive: true })

    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, "utf8")
    return true
  } catch (error: any) {
    console.error(`Error writing JSON file ${filePath}:`, error)
    return false
  }
}
