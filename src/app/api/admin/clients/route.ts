
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = prisma as any;
    
    const registrations = await db.companyRegistration.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json({ success: true, data: registrations });

  } catch (error: any) {
    console.error("Admin Clients API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ success: false, message: "Missing id or status" }, { status: 400 });
        }

        const db = prisma as any;
        const updated = await db.companyRegistration.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        console.error("Update Status Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
