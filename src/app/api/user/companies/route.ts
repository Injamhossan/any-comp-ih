
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');  

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    // Cast prisma to any to avoid TS errors if client generation failed
    const db = prisma as any;

    // Find User
    let user = await db.user.findUnique({
      where: { email },
      include: { registrations: true }
    });

    if (!user) {
       // Create User Sync
       user = await db.user.create({
         data: { 
            email,
            name: name || email.split('@')[0],
            role: 'USER'
         }
       });
       // Return empty registrations
       return NextResponse.json({ success: true, data: [] });
    }

    return NextResponse.json({ success: true, data: user.registrations || [] });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
      const body = await req.json();
      const { email, companyName, companyType, companyLogoUrl } = body;

      if (!email || !companyName) {
           return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
      }

      const db = prisma as any;
      
            // Ensure user exists and verify single registration
      let user = await db.user.findUnique({ 
          where: { email },
          include: { registrations: true }
      });
      
      if (!user) {
          user = await db.user.create({ data: { email, role: 'USER' } });
      }

      // Check if user already has ANY registration (PENDING, APPROVED, etc.)
      // We explicitly deny multiple registrations per user.
      if (user.registrations && user.registrations.length > 0) {
          return NextResponse.json({ 
              success: false, 
              message: "Limit Reached: You have already registered a company. Only one company registration is allowed per user." 
          }, { status: 400 });
      }

      const registration = await db.companyRegistration.create({
          data: {
              userId: user.id,
              companyName,
              companyType,
              companyLogoUrl, 
              status: 'PENDING'
          }
      });

      // Update User Profile with company info for easier access
      await db.user.update({
          where: { id: user.id },
          data: {
              company_name: companyName,
              company_logo_url: companyLogoUrl
          }
      });

      return NextResponse.json({ success: true, data: registration });

  } catch(error: any) {
      console.error(error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
