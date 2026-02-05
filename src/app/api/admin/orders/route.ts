import { NextResponse } from "next/server";
import { getOrders } from "@/modules/order/order.service";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Admin Order Fetch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
