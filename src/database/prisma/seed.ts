import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'pharmacyadmin@gmail.com';
  const adminEmpId = 'EMP-001';

  // Check if admin already exists
  const existingAdmin = await prisma.employee.findFirst({
    where: {
      OR: [{ email: adminEmail }, { empId: adminEmpId }],
    },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminPharma-12345', 10);

    await prisma.employee.create({
      data: {
        name: 'System Administrator',
        empId: adminEmpId,
        email: adminEmail,
        password: hashedPassword,
        role: 'OWNER',
        shift: 'DAY',
        salary: 5000000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567890',
        alamat: 'Office HQ',
      },
    });
    console.log('✅ Default admin user created successfully.');
  } else {
    console.log('ℹ️ Admin user already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
