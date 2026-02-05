
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const message = await prisma.message.create({
            data: body
        });
        return NextResponse.json({ success: true, data: message });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Error sending message" }, { status: 500 });
    }
}
