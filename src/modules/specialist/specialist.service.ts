
import { Specialist } from "@prisma/client";
import prisma from "@/lib/db"; // Assuming you have a shared prisma client instance

export const createSpecialist = async (data: any): Promise<Specialist> => {
  return await prisma.specialist.create({
    data,
  });
};

export const getAllSpecialists = async (): Promise<Specialist[]> => {
  return await prisma.specialist.findMany({
    where: { deleted_at: null },
    include: { media: true },
  });
};

export const getSpecialistById = async (id: string): Promise<Specialist | null> => {
  return await prisma.specialist.findUnique({
    where: { id },
    include: { media: true, service_offerings: true },
  });
};

export const getSpecialistByOwner = async (email: string, name?: string): Promise<Specialist | null> => {
   // Fallback: Search by Name first since email migration might be blocked
   if (name) {
       const byName = await prisma.specialist.findFirst({
           where: { secretary_name: name, deleted_at: null },
           include: { media: true }
       });
       if (byName) return byName;
   }

   // Then try email (might fail if schema not updated, so wrapping in try/catch or just avoiding if possible)
   // For now, we rely on name.
   return null;
};


export const updateSpecialist = async (id: string, data: any): Promise<Specialist> => {
   return await prisma.specialist.update({
    where: { id },
    data,
  });
};

export const deleteSpecialist = async (id: string): Promise<Specialist> => {
  // Soft delete
  return await prisma.specialist.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};
