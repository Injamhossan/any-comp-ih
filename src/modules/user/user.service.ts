import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      registrations: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  });
};

export const updateUserProfile = async (email: string, data: any) => {
  return await prisma.user.update({
    where: { email },
    data: {
      name: data.name,
      phone: data.phone,
      description: data.description,
      company_name: data.company_name,
      company_logo_url: data.company_logo_url,
      certifications: data.certifications,
      photo_url: data.photo_url || data.photoUrl,
      clients_count: data.clients_count ? parseInt(data.clients_count) : undefined,
      experience_years: data.experience_years ? parseInt(data.experience_years) : undefined,
      firm_description: data.firm_description
    }
  });
};
