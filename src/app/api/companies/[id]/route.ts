import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: false, message: "Disabled" }, { status: 403 });
}

export async function PUT() {
  return NextResponse.json({ success: false, message: "Disabled" }, { status: 403 });
}
