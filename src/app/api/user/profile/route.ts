
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const db = prisma as any;

    const user = await db.user.findUnique({
      where: { email },
      include: {
        registrations: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name, phone } = body; // Assume phone might be added later to schema

        if (!email) return NextResponse.json({ success: false, message: "Email is required for update" }, { status: 400 });

        const db = prisma as any;

        const user = await db.user.update({
            where: { email },
            data: {
                name,
                phone: body.phone,
                description: body.description,
                company_name: body.company_name,
                company_logo_url: body.company_logo_url,
                certifications: body.certifications,
                photo_url: body.photo_url || body.photoUrl 
            }
        });

        return NextResponse.json({ success: true, data: user });
    } catch(err: any) {
        console.error("Profile Update Error:", err);
        return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
    }
}
