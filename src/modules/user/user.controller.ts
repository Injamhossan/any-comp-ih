
import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, updateUserProfile } from "./user.service";

export const getProfile = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const updateProfile = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { email } = body; 

        if (!email) return NextResponse.json({ success: false, message: "Email is required for update" }, { status: 400 });

        const user = await updateUserProfile(email, body);

        return NextResponse.json({ success: true, data: user });
    } catch(err: any) {
        console.error("Profile Update Error:", err);
        return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
    }
};
