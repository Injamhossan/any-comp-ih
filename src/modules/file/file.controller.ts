
import { NextRequest, NextResponse } from "next/server";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebase/firebase.config";

export const uploadFile = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: "No file received or file is a string." }, { status: 400 });
    }

    const fileObject = file as File;
    const arrayBuffer = await fileObject.arrayBuffer();
    // Convert ArrayBuffer to Uint8Array which is compatible with Firebase Storage
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Sanitize filename
    const sanitizedFilename = fileObject.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9.\-_]/g, '');
    const filename = `${Date.now()}_${sanitizedFilename}`;
    
    // Initialize Firebase Storage
    const storage = getStorage(app);
    const storageRef = ref(storage, `uploads/${filename}`);

    // Upload to Firebase Storage
    const snapshot = await uploadBytes(storageRef, uint8Array, {
        contentType: fileObject.type
    });

    // Get the public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return NextResponse.json({ 
        success: true, 
        url: downloadURL,
        filename: filename,
        mimeType: fileObject.type,
        size: fileObject.size
    });
  } catch (error: any) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
