
import { NextRequest, NextResponse } from "next/server";
import * as SpecialistService from "./specialist.service";

export const create = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const specialist = await SpecialistService.createSpecialist(body);
    return NextResponse.json({ success: true, data: specialist }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const index = async (req: NextRequest) => {
  try {
    const specialists = await SpecialistService.getAllSpecialists();
    return NextResponse.json({ success: true, data: specialists }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const show = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const specialist = await SpecialistService.getSpecialistById(params.id);
    if (!specialist) {
       return NextResponse.json({ success: false, message: "Not Found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: specialist }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const update = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const body = await req.json();
    const specialist = await SpecialistService.updateSpecialist(params.id, body);
    return NextResponse.json({ success: true, data: specialist }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};

export const remove = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
     await SpecialistService.deleteSpecialist(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
};
