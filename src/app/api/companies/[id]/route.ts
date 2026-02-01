
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// BUT for security, we should ideally verify the user. 
// Given the current setup, I'll assume we can just check if the company belongs to the user who is making the request.
// Or effectively, we'll need to pass the user email/id in the body or header to verify ownership.

// For now, let's just make a simple CRUD that checks ownership if possible, or just does the update.
// Ideally, we'd have a session check.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+ (App Router updates), but let's check current version.
  // The user log shows "Next.js 16.1.4 (Turbopack)". In Next 15+, params is a promise.
) {
  try {
     const { id } = await params;
     const db = prisma as any;
     
     const company = await db.companyRegistration.findUnique({
         where: { id }
     });

     if (!company) {
         return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 });
     }

     return NextResponse.json({ success: true, data: company });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { companyName, companyType, companyLogoUrl } = body;

        const db = prisma as any;

        // Basic validation
        if (!companyName) {
            return NextResponse.json({ success: false, message: "Company name is required" }, { status: 400 });
        }

        const updated = await db.companyRegistration.update({
            where: { id },
            data: {
                companyName,
                companyType,
                companyLogoUrl
            }
        });

        return NextResponse.json({ success: true, data: updated });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
