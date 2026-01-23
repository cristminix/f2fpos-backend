import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zBodyValidator } from "@hono-dev/zod-body-validator";
import { createHonoWithBindings } from "../../global/fn/createHonoWithBindings";
import { file_uploads } from "../../db/schema";
import MFileUpload from "../../global/models/MFileUpload";

const fileUploadCreateValidationSchema = z.object({
  fileName: z.string(),
  size: z.number(),
  mimeType: z.string(),
});

const fileUploadUpdateValidationSchema = z.object({
  fileName: z.string().optional(),
  size: z.number().optional(),
  mimeType: z.string().optional(),
});

const app = createHonoWithBindings();

// Get all file uploads
app.get("/", async (c) => {
  const mFileUpload = new MFileUpload(c);

  const { limit = 1000, page = 1, sortField, sortOrder } = c.req.query();

  // Build order object if sortField and sortOrder are provided
  let order = null;
  if (sortField && sortOrder) {
    // Validate sortField to ensure it's a valid field in the schema
    const validSortFields = ["id", "fileName", "size", "mimeType", "timestamp"];
    if (validSortFields.includes(sortField)) {
      const direction = sortOrder.toLowerCase() === "desc" ? "desc" : "asc";
      //@ts-ignore
      order = { [sortField]: direction };
    }
  }

  const result = await mFileUpload.getList(
    Number(limit),
    Number(page),
    order, // Pass the order object to getList
  );

  return c.json(result);
});

// Get file upload by ID
app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mFileUpload = new MFileUpload(c);
  const fileUpload = await mFileUpload.getRow(id);

  if (!fileUpload) {
    return c.json({ success: false, message: "File upload not found" }, 404);
  }

  return c.json({ success: true, data: fileUpload });
});

// Upload a new file
app.post("/", async (c) => {
  const formData = await c.req.parseBody();

  // Handle file upload
  if (formData instanceof FormData) {
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ success: false, message: "No file uploaded" }, 400);
    }

    const mFileUpload = new MFileUpload(c);

    try {
      // Create a record in the database
      const fileUploadData = {
        fileName: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      };

      const [result] = await mFileUpload.create(fileUploadData);

      return c.json({
        success: true,
        data: { ...result, url: `/uploads/${result.id}` },
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  } else {
    return c.json({ success: false, message: "Invalid form data" }, 400);
  }
});

// Alternative POST endpoint that accepts form data directly
app.post("/upload", async (c) => {
  const formData = await c.req.parseBody();

  // Handle file upload
  if (formData instanceof FormData) {
    const file = formData.get("file") as File | null;

    if (!file) {
      return c.json({ success: false, message: "No file uploaded" }, 400);
    }

    const mFileUpload = new MFileUpload(c);

    try {
      // Create a record in the database
      const fileUploadData = {
        fileName: file.name,
        size: file.size,
        mimeType: file.type || "application/octet-stream",
      };

      const [result] = await mFileUpload.create(fileUploadData);

      return c.json({
        success: true,
        data: { ...result, url: `/uploads/${result.id}` },
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  } else {
    return c.json({ success: false, message: "Invalid form data" }, 400);
  }
});

// Update file upload by ID
app.put("/:id", zBodyValidator(fileUploadUpdateValidationSchema), async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const fileUploadData = c.req.valid("form");

  const mFileUpload = new MFileUpload(c);

  // Check if file upload exists
  const existingFileUpload = await mFileUpload.getRow(id);

  if (!existingFileUpload) {
    return c.json({ success: false, message: "File upload not found" }, 404);
  }

  try {
    const [result] = await mFileUpload.update(id, fileUploadData);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Delete file upload by ID
app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ success: false, message: "Invalid ID" }, 400);
  }

  const mFileUpload = new MFileUpload(c);

  // Check if file upload exists
  const existingFileUpload = await mFileUpload.getRow(id);
  if (!existingFileUpload) {
    return c.json({ success: false, message: "File upload not found" }, 404);
  }

  try {
    const [result] = await mFileUpload.delete(id, existingFileUpload);
    return c.json({ success: true, data: result });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
