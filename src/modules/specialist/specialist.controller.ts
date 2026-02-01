
import { NextRequest, NextResponse } from "next/server";
import { createSpecialist, getAllSpecialists, getSpecialistById, updateSpecialist, deleteSpecialist } from "./specialist.service";

export const create = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const specialist = await createSpecialist(body);
    return NextResponse.json({ success: true, data: specialist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const index = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');

    if (email || name) {
      // Find my specialist profile
      const { getSpecialistByOwner } = await import("./specialist.service");
      const specialist = await getSpecialistByOwner(email || "", name || undefined);
      if (specialist) {
         return NextResponse.json({ success: true, data: [specialist] }, { status: 200 }); 
      } else {
         return NextResponse.json({ success: true, data: [] }, { status: 200 });
      }
    }

    const specialists = await getAllSpecialists();
    return NextResponse.json({ success: true, data: specialists }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const show = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const specialist = await getSpecialistById(id);
    if (!specialist) {
       return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: specialist }, { status: 200 });
  } catch (error: any) {
    console.error("Show Specialist Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const update = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();
    
    console.log(`[Backend-Update] Updating Specialist ID: ${id}`);
    console.log(`[Backend-Update] Payload:`, JSON.stringify(body, null, 2));

    if (!id) {
        throw new Error("Missing ID Parameter");
    }

    const specialist = await updateSpecialist(id, body);
    return NextResponse.json({ success: true, data: specialist }, { status: 200 });
  } catch (error: any) {
    console.error("[Backend-Update] Critical Error:", error);
    // Return the actual error message to the client for the alert
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
};

export const remove = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
     await deleteSpecialist(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
