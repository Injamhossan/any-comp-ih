
import { NextResponse } from "next/server";
import { getMasterList } from "./service-offering.service";

export const index = async () => {
  try {
    const data = await getMasterList();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Fetch Master List Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};
