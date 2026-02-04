

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@anycomp.com' },
    update: {
      role: 'ADMIN', // Ensure role is always ADMIN
      password: hashedPassword // Ensure password is set/updated
    },
    create: {
      email: 'admin@anycomp.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      description: 'System Administrator',
    },
  })

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'USER',
      description: 'A demo user for testing',
    },
  })

  // Create a specialist
  const specialist = await prisma.specialist.upsert({
    where: { slug: 'demo-service' },
    update: {},
    create: {
      title: 'Expert Web Development',
      slug: 'demo-service',
      description: 'Professional web development services using Next.js and Prisma.',
      base_price: 500,
      platform_fee: 50,
      final_price: 550,
      duration_days: 7,
      is_verified: true,
      verification_status: 'VERIFIED',
      secretary_name: 'Jane Doe', 
      secretary_company: 'Tech Solutions Ltd',
      secretary_email: 'secretary@techsolutions.com',
    },
  })

  console.log({ admin, user, specialist })
  console.log('Seeding finished.')
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
