import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "./order.service";

export const create = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const index = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const specialistId = searchParams.get("specialistId");
    
    const orders = await getOrders(userId || undefined, specialistId || undefined);
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const update = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // Lazy load helper to avoid circular deps if any
    const { updateOrder } = await import("./order.service");
    const order = await updateOrder(id, body);
    
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
