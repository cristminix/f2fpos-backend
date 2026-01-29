// Define basic interfaces for request and response
interface FileUploadRequestBody {
  filename: string
  content: string
  contentType?: string
}

interface FileUploadRequest {
  body: FileUploadRequestBody
}

interface FileUploadResponse {
  success: boolean
  fileId?: string
  error?: string
}

export class FileUploadService {
  private kvNamespace: KVNamespace

  constructor(kvNamespace: KVNamespace) {
    this.kvNamespace = kvNamespace
  }

  /**
   * Upload a file to Cloudflare KV store
   */
  async uploadFile(request: FileUploadRequest): Promise<FileUploadResponse> {
    try {
      const { filename, content, contentType } = request.body

      if (!filename || !content) {
        return {
          success: false,
          error: "Filename and content are required",
        }
      }

      // Generate a unique file ID
      const fileId = this.generateFileId(filename)

      // Prepare file metadata
      const fileData = {
        id: fileId,
        filename,
        content,
        contentType: contentType || "application/octet-stream",
        uploadedAt: new Date().toISOString(),
        size: content.length,
      }

      // Store file in KV namespace
      await this.kvNamespace.put(fileId, JSON.stringify(fileData))

      return {
        success: true,
        fileId,
      }
    } catch (error) {
      console.error("Error uploading file to KV:", error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }
    }
  }

  /**
   * Get a file from Cloudflare KV store
   */
  async getFile(fileId: string): Promise<any> {
    try {
      const fileData = await this.kvNamespace.get(fileId)

      if (!fileData) {
        return null
      }

      return JSON.parse(fileData)
    } catch (error) {
      console.error("Error retrieving file from KV:", error)
      throw error
    }
  }

  /**
   * Delete a file from Cloudflare KV store
   */
  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.kvNamespace.delete(fileId)
      return true
    } catch (error) {
      console.error("Error deleting file from KV:", error)
      return false
    }
  }

  /**
   * Generate a unique file ID based on filename and timestamp
   */
  private generateFileId(filename: string): string {
    const timestamp = Date.now()
    const randomPart = Math.random().toString(36).substring(2, 10)
    const cleanFilename = filename.replace(/[^a-zA-Z0-9]/g, "_")

    return `${cleanFilename}_${timestamp}_${randomPart}`
  }

  /**
   * List all files in the KV namespace (with optional prefix filtering)
   */
  async listFiles(
    prefix?: string,
  ): Promise<Array<{ id: string; filename: string; uploadedAt: string }>> {
    try {
      const listOptions: KVNamespaceListOptions = {}
      if (prefix) {
        listOptions.prefix = prefix
      }

      const result = await this.kvNamespace.list(listOptions)
      const files: Array<{ id: string; filename: string; uploadedAt: string }> =
        []

      for (const key of result.keys) {
        const fileData = await this.kvNamespace.get(key.name)
        if (fileData) {
          const parsedData = JSON.parse(fileData as string)
          files.push({
            id: key.name,
            filename: parsedData.filename,
            uploadedAt: parsedData.uploadedAt,
          })
        }
      }

      return files
    } catch (error) {
      console.error("Error listing files from KV:", error)
      throw error
    }
  }
}

// Export a function to initialize the service with the KV namespace
export const createFileUploadService = (
  kvNamespace: KVNamespace,
): FileUploadService => {
  return new FileUploadService(kvNamespace)
}

// The FileUploadService class is already exported as default from the class definition
