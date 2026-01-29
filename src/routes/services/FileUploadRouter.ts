import { Hono } from "hono"
import { createFileUploadService, FileUploadService } from "./FileUploadService"
import { Env } from "../../global/types/Env"

// Define the context type with variables
type FileUploadContext = {
  Variables: {
    fileUploadService: FileUploadService
  }
}

const fileUploadRouter = new Hono<FileUploadContext & { Bindings: Env }>()

// Initialize the file upload service with the B2B_FILES_KV namespace
fileUploadRouter.use("*", async (c, next) => {
  // Get the KV namespace from environment bindings
  const kvNamespace = c.env.B2B_FILES_KV
  const fileUploadService = createFileUploadService(kvNamespace)

  // Attach the service to the context for use in handlers
  c.set("fileUploadService", fileUploadService)

  await next()
})

// Upload file endpoint
fileUploadRouter.post("/upload", async (c) => {
  try {
    const fileUploadService = c.get("fileUploadService")
    const body = await c.req.json()

    const result = await fileUploadService.uploadFile({ body })

    if (result.success) {
      return c.json({ success: true, fileId: result.fileId }, 200)
    } else {
      return c.json({ success: false, error: result.error }, 400)
    }
  } catch (error) {
    console.error("Error in file upload endpoint:", error)
    return c.json({ success: false, error: "Internal server error" }, 500)
  }
})

// Get file endpoint
fileUploadRouter.get("/:fileId", async (c) => {
  try {
    const fileUploadService = c.get("fileUploadService")
    const fileId = c.req.param("fileId")

    const fileData = await fileUploadService.getFile(fileId)

    if (fileData) {
      return c.json(fileData, 200)
    } else {
      return c.json({ success: false, error: "File not found" }, 404)
    }
  } catch (error) {
    console.error("Error in get file endpoint:", error)
    return c.json({ success: false, error: "Internal server error" }, 500)
  }
})

// Delete file endpoint
fileUploadRouter.delete("/:fileId", async (c) => {
  try {
    const fileUploadService = c.get("fileUploadService")
    const fileId = c.req.param("fileId")

    const result = await fileUploadService.deleteFile(fileId)

    if (result) {
      return c.json({ success: true }, 200)
    } else {
      return c.json({ success: false, error: "Failed to delete file" }, 500)
    }
  } catch (error) {
    console.error("Error in delete file endpoint:", error)
    return c.json({ success: false, error: "Internal server error" }, 500)
  }
})

// List files endpoint
fileUploadRouter.get("/", async (c) => {
  try {
    const fileUploadService = c.get("fileUploadService")

    // Optional prefix parameter for filtering
    const prefix = c.req.query("prefix")

    const files = await fileUploadService.listFiles(prefix)

    return c.json({ success: true, files }, 200)
  } catch (error) {
    console.error("Error in list files endpoint:", error)
    return c.json({ success: false, error: "Internal server error" }, 500)
  }
})

export default fileUploadRouter
