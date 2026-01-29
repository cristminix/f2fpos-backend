//@ts-ignore
import { basename } from "node:path"
//@ts-ignore
import { readFile } from "node:fs/promises"
import { API_BASE_URL } from "../config"
import { doFetchRequest } from "../fn/doFetchRequest"

async function getBase64FromFileContent(filePath: string): Promise<string> {
  // Get file extension to determine MIME type
  const ext = filePath.split(".").pop()?.toLowerCase()
  let mimeType = "application/octet-stream"

  // Map common image extensions to their MIME types
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    bmp: "image/bmp",
    tiff: "image/tiff",
    ico: "image/x-icon",
  }

  if (ext && mimeTypes[ext]) {
    mimeType = mimeTypes[ext]
  }

  // Read the file content as buffer
  const fileBuffer = await readFile(filePath)
  // Convert buffer to base64 string
  const base64Content = fileBuffer.toString("base64")

  // Return with data URI format
  return `data:${mimeType};base64,${base64Content}`
}

export async function seedProducts() {
  // Load data from JSON file
  const jsonData = await import("../produk_rempah.json", {
    assert: { type: "json" },
  })
  const productsData = jsonData.default

  const outletId = 1

  for (const product of productsData) {
    const { image } = product
    // await createProduct(product, outletId)
    const imagePath = `src/scripts/${image}`
    const content = await getBase64FromFileContent(imagePath)

    const imageFileUpload = {
      filename: basename(image),
      content,
    }
    console.log({ imageFileUpload })
    const response = await createProductImage(imageFileUpload)
    if (response.success) {
      const { fileId } = response
      if (fileId) {
        const productRow = await createProduct({ fileId, ...product }, outletId)
      }
      // console.log({ response })
    }
    // await
    // break
  }

  return productsData
}
async function createProductImage(imageUpload: any) {
  try {
    // Create the product first
    const producImagetResponse = await doFetchRequest(
      `${API_BASE_URL}/FileUploadService/upload`,
      {
        method: "POST",
        body: JSON.stringify({
          filename: imageUpload.filename,
          content: imageUpload.content,
          // We'll add fileId later if we successfully upload the image
        }),
      },
    )

    const productImageResult: any = await producImagetResponse.json()
    return productImageResult
  } catch (error) {
    console.error(
      `Error creating product image ${imageUpload.filename}:`,
      error,
    )
  }
}
async function createProduct(product: any, outletId: number) {
  try {
    // Create the product first
    const productResponse = await doFetchRequest(
      `${API_BASE_URL}/ProductService`,
      {
        method: "POST",
        body: JSON.stringify({
          outletId,
          timestamp: Date.now(),
          name: product.name,
          weight: product.weight,
          price: product.price,
          description: product.description,
          sku: product.sku,
          fileId: product.fileId,
          // We'll add fileId later if we successfully upload the image
        }),
      },
    )

    const productResult: any = await productResponse.json()

    if (productResponse.ok) {
      console.log(`Successfully created product: ${product.name}`)
    } else {
      console.error(
        `Seed Error for ${product.name}:`,
        productResult.message || "Unknown error",
      )
    }
  } catch (error) {
    console.error(`Error creating product ${product.name}:`, error)
  }
}
