import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Files disabled" }, { status: 403 });
}
