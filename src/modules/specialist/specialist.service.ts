import { Specialist, MediaType, MimeType } from "@prisma/client";
import prisma from "@/lib/db"; 

// Helper to construct media create input
const prepareMediaCreate = (urls: string[]) => {
  return {
    create: urls.map((url, index) => ({
      file_name: url.split('/').pop() || `image-${index}`,
      file_size: 0,
      display_order: index,
      url: url,
      media_type: MediaType.IMAGE,
      mime_type: MimeType.IMAGE_JPEG, // Defaulting for now
    }))
  };
};

export const createSpecialist = async (data: any): Promise<Specialist> => {
  const { media_urls, ...rest } = data;
  
  const createData: any = { ...rest };
  if (media_urls && Array.isArray(media_urls)) {
      createData.media = prepareMediaCreate(media_urls);
  }

  return await prisma.specialist.create({
    data: createData,
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
   // 1. Search by Email (More reliable)
   if (email) {
       const byEmail = await prisma.specialist.findFirst({
           where: { secretary_email: email, deleted_at: null },
           include: { media: true }
       });
       if (byEmail) return byEmail;
   }

   // 2. Fallback: Search by Name
   if (name) {
       const byName = await prisma.specialist.findFirst({
           where: { secretary_name: name, deleted_at: null },
           include: { media: true }
       });
       if (byName) return byName;
   }
   return null;
};


export const updateSpecialist = async (id: string, data: any): Promise<Specialist> => {
  const { media_urls, ...rest } = data;

  const updateData: any = { ...rest };
  if (media_urls && Array.isArray(media_urls)) {
      updateData.media = {
          deleteMany: {}, // Clear existing media
          ...prepareMediaCreate(media_urls)
      };
  }

   return await prisma.specialist.update({
    where: { id },
    data: updateData,
  });
};

export const deleteSpecialist = async (id: string): Promise<Specialist> => {
  // Soft delete
  return await prisma.specialist.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};
