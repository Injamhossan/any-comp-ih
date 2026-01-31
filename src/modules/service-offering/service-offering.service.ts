
import prisma from "@/lib/db";

export const getMasterList = async () => {
  return await prisma.serviceOfferingMasterList.findMany();
};
