import { Specialist } from "@/entities/Specialist";
import { Media } from "@/entities/Media";
import { getDataSource } from "@/lib/data-source";
import { MediaType, MimeType, VerificationStatus } from "@/entities/Enums";
import { In, IsNull } from "typeorm";

// Helper to construct media create input
const prepareMediaCreate = (urls: string[]) => {
  return urls.map((url, index) => {
    const media = new Media();
    media.file_name = url.split('/').pop() || `image-${index}`;
    media.file_size = 0;
    media.display_order = index;
    media.url = url;
    media.media_type = MediaType.IMAGE;
    media.mime_type = MimeType.IMAGE_JPEG;
    return media;
  });
};

export const createSpecialist = async (data: any): Promise<Specialist> => {
  console.log("[Service-Create] Starting creation with data keys:", Object.keys(data));
  
  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

  // We rely on TypeORM's cascade: true to handle media and service_offerings
  // Ensure we don't have conflicting media_urls/media structure
  const { media_urls, ...rest } = data;
  
  const specialist = specialistRepo.create(rest as Object); 
  
  // If the frontend somehow sent media_urls instead of media relation
  if (media_urls && Array.isArray(media_urls) && (!specialist.media || specialist.media.length === 0)) {
      specialist.media = prepareMediaCreate(media_urls);
  }

  try {
    const result = await specialistRepo.save(specialist);
    console.log("[Service-Create] Success! Specialist ID:", result.id);
    return result;
  } catch (error: any) {
    console.error("[Service-Create] Database Error:", error);
    throw error;
  }
};

export const getAllSpecialists = async (includeUnverified = false): Promise<Specialist[]> => {
  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

  const whereClause: any = { deleted_at: IsNull() };
  
  if (!includeUnverified) {
      whereClause.verification_status = VerificationStatus.VERIFIED;
      whereClause.is_draft = false; 
  }

  return await specialistRepo.find({
    where: whereClause,
    relations: ["media"],
    order: { created_at: 'DESC' } 
  });
};

export const getSpecialistById = async (id: string): Promise<Specialist | null> => {
  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

  return await specialistRepo.findOne({
    where: { id },
    relations: ["media", "service_offerings"],
  });
};

export const getSpecialistBySlug = async (slug: string): Promise<Specialist | null> => {
  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

  return await specialistRepo.findOne({
    where: { slug },
    relations: ["media", "service_offerings"],
  });
};

export const getSpecialistByOwner = async (email: string, name?: string): Promise<Specialist | null> => {
   const dataSource = await getDataSource();
   const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

   // 1. Search by Email (More reliable)
   if (email) {
       const byEmail = await specialistRepo.findOne({
           where: { secretary_email: email, deleted_at: IsNull() },
           relations: ["media"]
       });
       if (byEmail) return byEmail;
   }

   // 2. Fallback: Search by Name
   if (name) {
       const byName = await specialistRepo.findOne({
           where: { secretary_name: name, deleted_at: IsNull() },
           relations: ["media"]
       });
       if (byName) return byName;
   }
   return null;
};


export const updateSpecialist = async (id: string, data: any): Promise<Specialist> => {
  const { media_urls, ...rest } = data;
  console.log(`[Service-Update] Updating Specialist ${id} with keys:`, Object.keys(rest));

  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");

  const existing = await specialistRepo.findOne({
      where: { id },
      relations: ["media", "service_offerings"]
  });
  
  if (!existing) throw new Error("Specialist not found");

  // If new media are provided, we should clear the old ones to avoid duplicates/orphans
  if (rest.media && Array.isArray(rest.media)) {
      const mediaRepo = dataSource.getRepository("Media");
      await mediaRepo.delete({ specialist_id: id });
  }

  // Handle service_offerings replacement 
  if (rest.service_offerings && Array.isArray(rest.service_offerings)) {
      const { ServiceOffering } = await import("@/entities/ServiceOffering");
      const offeringRepo = dataSource.getRepository("ServiceOffering");
      await offeringRepo.delete({ specialist_id: id });
  }

  // Update primitive fields and relations via merge
  specialistRepo.merge(existing, rest);

  // If old-style media_urls was sent
  if (media_urls && Array.isArray(media_urls) && (!existing.media || existing.media.length === 0)) {
      existing.media = prepareMediaCreate(media_urls);
  }

  try {
      const result = await specialistRepo.save(existing);
      console.log(`[Service-Update] Success! ID: ${id}`);
      return result;
  } catch (error: any) {
      console.error(`[Service-Update] Database Error:`, error);
      throw error;
  }
};

export const deleteSpecialist = async (id: string): Promise<Specialist> => {
  const dataSource = await getDataSource();
  const specialistRepo = dataSource.getRepository<Specialist>("Specialist");
  
  const existing = await specialistRepo.findOneBy({ id });
    if (!existing) throw new Error("Specialist not found");
    
    existing.deleted_at = new Date();
    
    return await specialistRepo.save(existing);
};
