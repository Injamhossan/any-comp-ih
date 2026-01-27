
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
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
    
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        console.error("Mkdir error:", e);
    }

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
        success: true, 
        url: fileUrl,
        filename: filename,
        mimeType: fileObject.type,
        size: fileObject.size
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
