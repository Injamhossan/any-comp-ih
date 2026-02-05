import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "File ID required" }, { status: 400 });
    }

    try {
        const fileRecord = await prisma.file.findUnique({
            where: { id: id }
        });

        if (!fileRecord) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const buffer = fileRecord.data;

        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": fileRecord.mimeType,
                "Content-Length": fileRecord.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable"
            }
        });

    } catch (error) {
        console.error("Error serving file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
