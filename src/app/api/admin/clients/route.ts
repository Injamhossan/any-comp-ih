import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}

export async function PATCH() {
  return NextResponse.json({ success: false, message: "Disabled" }, { status: 403 });
}
