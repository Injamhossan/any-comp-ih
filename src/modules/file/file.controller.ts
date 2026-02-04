import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const uploadFile = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: "No file received or file is a string." }, { status: 400 });
    }

    const fileObject = file as File;
    const arrayBuffer = await fileObject.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Sanitize filename
    const sanitizedFilename = fileObject.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}_${sanitizedFilename}`;
    
    // Set up upload directory (public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Create directory if it doesn't exist
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // The public URL for the file
    const downloadURL = `/uploads/${filename}`;

    return NextResponse.json({ 
        success: true, 
        url: downloadURL,
        filename: filename,
        mimeType: fileObject.type,
        size: fileObject.size
    });
  } catch (error: any) {
    console.error("Local Upload Error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
};
