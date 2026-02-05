import { NextResponse } from "next/server";

export const uploadFile = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert to Base64 Data URI
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUri, // This will be stored directly in the DB
      filename: file.name,
      mimeType: file.type,
      size: file.size
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
