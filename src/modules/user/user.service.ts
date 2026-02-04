import { prisma } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      registrations: {
        orderBy: {
          createdAt: 'desc'
        },
        take: 1
      }
    }
  }) as any;

  if (user && !user.company_name && user.registrations && user.registrations.length > 0) {
      user.company_name = user.registrations[0].companyName;
      user.company_logo_url = user.registrations[0].companyLogoUrl;
  }

  return user;
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
      image: data.photo_url || data.photoUrl || data.image,
      clients_count: data.clients_count ? parseInt(data.clients_count) : undefined,
      experience_years: data.experience_years ? parseInt(data.experience_years) : undefined,
      firm_description: data.firm_description
    } as any
  });
};
