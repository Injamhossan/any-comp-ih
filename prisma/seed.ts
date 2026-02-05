
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@anycomp.com' },
    update: { role: 'ADMIN', password: hashedPassword },
    create: {
      email: 'admin@anycomp.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      description: 'System Administrator',
    },
  })

  // 2. Create Normal User
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo Client',
      role: 'USER',
      description: 'A valued client',
      company_name: 'Tech Solutions Sdn Bhd'
    },
  })

  // 3. Create Specialist
  const specialist = await prisma.specialist.upsert({
    where: { slug: 'demo-service' },
    update: {},
    create: {
        title: 'Company Registration (Sdn Bhd)',
        slug: 'demo-service',
        description: 'Complete registration package for Private Limited Company.',
        base_price: 1500,
        platform_fee: 300,
        final_price: 1800,
        duration_days: 5,
        is_verified: true,
        verification_status: 'VERIFIED',
        is_draft: false,
        secretary_name: 'Jane Doe', 
        secretary_company: 'Top Secretarial Services',
    },
  })

  // 4. Create Messages
  await prisma.message.createMany({
      data: [
          { senderName: 'Alice Tan', senderEmail: 'alice@test.com', subject: 'Inquiry about pricing', content: 'Hi, can I get a custom quote?' },
          { senderName: 'Bob Lee', senderEmail: 'bob@test.com', subject: 'Document Status', content: 'Checking if my documents are approved.', isRead: true },
      ],
      skipDuplicates: true,
  })

  // 5. Create Invoices
  await prisma.invoice.createMany({
      data: [
          { invoiceNumber: 'INV-001', amount: 1800, status: 'PAID', userId: user.id },
          { invoiceNumber: 'INV-002', amount: 500, status: 'PENDING', userId: user.id },
          { invoiceNumber: 'INV-003', amount: 1200, status: 'OVERDUE', userId: user.id },
      ],
      skipDuplicates: true,
  })

  // 6. Create Documents
  await prisma.document.createMany({
      data: [
          { title: 'Annual Return 2024.pdf', url: '#', status: 'PENDING', userId: user.id, signatoriesCount: 2, signedCount: 1 },
          { title: 'Director Resolution.pdf', url: '#', status: 'COMPLETED', userId: user.id, signatoriesCount: 1, signedCount: 1 },
      ],
      skipDuplicates: true,
  })

  // 7. Create Orders
  await prisma.order.createMany({
      data: [
          { userId: user.id, specialistId: specialist.id, amount: 1800, status: 'PAID', customerName: user.name, customerEmail: user.email },
      ],
      skipDuplicates: true,
  })


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
