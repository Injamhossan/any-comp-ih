
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!id || !status) {
        return NextResponse.json({ success: false, message: "Missing ID or Status" }, { status: 400 });
    }

    // Validate Status Enum
    const validStatuses = ["PENDING", "PAID", "CANCELLED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
         return NextResponse.json({ success: false, message: "Invalid Status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error("Order Update Failed:", error);
    return NextResponse.json({ success: false, message: error.message || "Internal Error" }, { status: 500 });
  }
}
