
import { prisma } from "@/lib/db";

async function checkSpecialists() {
  const specialists = await prisma.specialist.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      avatar_url: true,
      secretary_company_logo: true
    }
  });

  console.log(JSON.stringify(specialists, null, 2));
}

checkSpecialists()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
