
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  console.log('Total Users found:', users.length);
  console.table(users);
  
  const userRoleCount = await prisma.user.count({
    where: {
      role: 'USER'
    }
  });
  console.log('Count of users with role "USER":', userRoleCount);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
