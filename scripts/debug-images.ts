import "dotenv/config";
import { getDataSource } from "@/lib/data-source";
import { Specialist } from "@/entities/Specialist";

async function checkSpecialists() {
  const dataSource = await getDataSource();
  const specialistRepository = dataSource.getRepository(Specialist);

  const specialists = await specialistRepository.find({
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
    const dataSource = await getDataSource();
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  })
