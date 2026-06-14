import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Cleaning up existing database records...');

  // Delete dependent records first to avoid foreign key violations
  await prisma.activityLog.deleteMany({});
  await prisma.transactionDetail.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.orderDetail.deleteMany({});
  await prisma.medicineOrder.deleteMany({});
  await prisma.medicine.deleteMany({});
  await prisma.medicineCategory.deleteMany({});
  await prisma.supplier.deleteMany({});
  await prisma.employee.deleteMany({});

  console.log('✅ Clean up complete.');
  console.log('🌱 Seeding database...');

  // ----------------------------------------------------
  // 1. SEED EMPLOYEES (7 records)
  // ----------------------------------------------------
  console.log('👥 Seeding employees...');
  const commonPassword = await bcrypt.hash('Pharma@12345', 10);
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const ownerPassword = await bcrypt.hash('Owner@12345', 10);

  const employees = await Promise.all([
    // Admin (1)
    prisma.employee.create({
      data: {
        name: 'System Administrator',
        empId: 'EMP-001',
        email: 'pharmacyadmin@gmail.com',
        password: adminPassword,
        role: 'ADMIN',
        shift: 'DAY',
        salary: 6000000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567890',
        alamat: 'Admin Office HQ, Suite A',
      },
    }),
    // Owner (1)
    prisma.employee.create({
      data: {
        name: 'Pharmacy Owner',
        empId: 'EMP-002',
        email: 'pharmacyowner@gmail.com',
        password: ownerPassword,
        role: 'OWNER',
        shift: 'DAY',
        salary: 10000000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567891',
        alamat: 'Owner HQ Office, Suite B',
      },
    }),
    // Pharmacists (3)
    prisma.employee.create({
      data: {
        name: 'Sarah Connor',
        empId: 'EMP-003',
        email: 'sarah.pharmacist@gmail.com',
        password: commonPassword,
        role: 'PHARMACIST',
        shift: 'DAY',
        salary: 4500000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567892',
        alamat: 'East District, Block 4',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'John Doe',
        empId: 'EMP-004',
        email: 'john.pharmacist@gmail.com',
        password: commonPassword,
        role: 'PHARMACIST',
        shift: 'EVENING',
        salary: 4500000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567893',
        alamat: 'West District, Lane 12',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Alice Smith',
        empId: 'EMP-005',
        email: 'alice.pharmacist@gmail.com',
        password: commonPassword,
        role: 'PHARMACIST',
        shift: 'NIGHT',
        salary: 4800000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567894',
        alamat: 'Central Town Area, No. 45',
      },
    }),
    // Cashiers (2)
    prisma.employee.create({
      data: {
        name: 'Bob Johnson',
        empId: 'EMP-006',
        email: 'bob.cashier@gmail.com',
        password: commonPassword,
        role: 'CASHIER',
        shift: 'DAY',
        salary: 3500000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567895',
        alamat: 'South District Suburb',
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Charlie Brown',
        empId: 'EMP-007',
        email: 'charlie.cashier@gmail.com',
        password: commonPassword,
        role: 'CASHIER',
        shift: 'EVENING',
        salary: 3500000,
        startDate: new Date(),
        status: 'ACTIVE',
        phoneNumber: '081234567896',
        alamat: 'North District Suburb',
      },
    }),
  ]);

  console.log(`✅ Seeded ${employees.length} employees.`);

  // ----------------------------------------------------
  // 2. SEED SUPPLIERS (10 records)
  // ----------------------------------------------------
  console.log('🏭 Seeding suppliers...');
  const suppliersData = [
    { name: 'Kalbe Farma Tbk', contact: 'Budi Santoso', email: 'budi.s@kalbe.co.id', license: 'LIC-KF-90182' },
    { name: 'Kimia Farma Apotek', contact: 'Siti Rahma', email: 'siti.r@kimiafarma.co.id', license: 'LIC-KF-10928' },
    { name: 'Sango Pharma Distribution', contact: 'David Lee', email: 'd.lee@sangopharma.com', license: 'LIC-SP-38291' },
    { name: 'Indofarma Global Medika', contact: 'Agus Wijaya', email: 'agus.w@indofarma.co.id', license: 'LIC-IF-47281' },
    { name: 'Tempo Scan Pacific', contact: 'Linda Wong', email: 'linda.w@temposcan.com', license: 'LIC-TS-98301' },
    { name: 'Phapros Pharmaceutical', contact: 'Eko Prasetyo', email: 'eko.p@phapros.co.id', license: 'LIC-PP-28193' },
    { name: 'Dexa Medica', contact: 'Rudi Hermawan', email: 'rudi.h@dexamedica.com', license: 'LIC-DM-47201' },
    { name: 'Sanbe Farma', contact: 'Yanti Tan', email: 'yanti.t@sanbefarma.com', license: 'LIC-SF-38201' },
    { name: 'Soho Global Health', contact: 'Robert Chen', email: 'r.chen@soho.co.id', license: 'LIC-SG-58291' },
    { name: 'Bio Farma Persero', contact: 'Hendra Setiawan', email: 'hendra.s@biofarma.co.id', license: 'LIC-BF-82910' }
  ];

  const suppliers = await Promise.all(
    suppliersData.map((s, idx) =>
      prisma.supplier.create({
        data: {
          companyName: s.name,
          phoneNumber: `021-55501${idx}`,
          contactName: s.contact,
          supplierEmail: s.email,
          status: 'ACTIVE',
          address: `Kawalan Industri No. ${idx + 15}, Jakarta, Indonesia`,
          licenseNumber: s.license,
        },
      })
    )
  );

  console.log(`✅ Seeded ${suppliers.length} suppliers.`);

  // ----------------------------------------------------
  // 3. SEED MEDICINE CATEGORIES (6 records)
  // ----------------------------------------------------
  console.log('🗂️ Seeding medicine categories...');
  const categoriesData = [
    { name: 'Analgesics', desc: 'Medications used to relieve pain (painkillers).' },
    { name: 'Antibiotics', desc: 'Medications used to treat and prevent bacterial infections.' },
    { name: 'Antihistamines', desc: 'Medications used to treat allergy symptoms.' },
    { name: 'Antipyretics', desc: 'Medications used to prevent or reduce fever.' },
    { name: 'Cardiovascular', desc: 'Medications related to heart and blood vessel disorders.' },
    { name: 'Vitamins & Supplements', desc: 'Micronutrients and nutritional products for general health.' }
  ];

  const categories = await Promise.all(
    categoriesData.map((c) =>
      prisma.medicineCategory.create({
        data: {
          categoryName: c.name,
          description: c.desc,
        },
      })
    )
  );

  console.log(`✅ Seeded ${categories.length} medicine categories.`);

  // ----------------------------------------------------
  // 4. SEED MEDICINES (20 records)
  // ----------------------------------------------------
  console.log('💊 Seeding medicines...');
  
  const medicinesData = [
    // Analgesics (0)
    { name: 'Paracetamol 500mg', sku: 'MED-PAR-500', price: 15000, stock: 120, catIdx: 0 },
    { name: 'Ibuprofen 400mg', sku: 'MED-IBU-400', price: 22000, stock: 85, catIdx: 0 },
    { name: 'Aspirin 81mg', sku: 'MED-ASP-81', price: 18000, stock: 100, catIdx: 0 },
    { name: 'Tramadol 50mg', sku: 'MED-TRA-50', price: 45000, stock: 50, catIdx: 0 },
    
    // Antibiotics (1)
    { name: 'Amoxicillin 500mg', sku: 'MED-AMX-500', price: 30000, stock: 150, catIdx: 1 },
    { name: 'Azithromycin 500mg', sku: 'MED-AZI-500', price: 85000, stock: 60, catIdx: 1 },
    { name: 'Ciprofloxacin 500mg', sku: 'MED-CIP-500', price: 42000, stock: 75, catIdx: 1 },
    { name: 'Doxycycline 100mg', sku: 'MED-DOX-100', price: 28000, stock: 90, catIdx: 1 },
    
    // Antihistamines (2)
    { name: 'Cetirizine 10mg', sku: 'MED-CET-10', price: 12000, stock: 200, catIdx: 2 },
    { name: 'Loratadine 10mg', sku: 'MED-LOR-10', price: 15000, stock: 180, catIdx: 2 },
    { name: 'Fexofenadine 120mg', sku: 'MED-FEX-120', price: 35000, stock: 80, catIdx: 2 },
    
    // Antipyretics (3)
    { name: 'Acetaminophen Suspension', sku: 'MED-ACT-SUS', price: 25000, stock: 65, catIdx: 3 },
    { name: 'Aspirin Junior 100mg', sku: 'MED-ASP-JUN', price: 14000, stock: 110, catIdx: 3 },
    { name: 'Ibuprofen Infant Drops', sku: 'MED-IBU-INF', price: 32000, stock: 40, catIdx: 3 },
    
    // Cardiovascular (4)
    { name: 'Amlodipine 5mg', sku: 'MED-AML-5', price: 20000, stock: 140, catIdx: 4 },
    { name: 'Atorvastatin 20mg', sku: 'MED-ATO-20', price: 65000, stock: 95, catIdx: 4 },
    { name: 'Metoprolol 50mg', sku: 'MED-MET-50', price: 38000, stock: 110, catIdx: 4 },
    
    // Vitamins & Supplements (5)
    { name: 'Vitamin C 1000mg', sku: 'MED-VITC-1000', price: 50000, stock: 250, catIdx: 5 },
    { name: 'Vitamin D3 1000IU', sku: 'MED-VITD-1000', price: 75000, stock: 120, catIdx: 5 },
    { name: 'Multivitamin Formula', sku: 'MED-MUL-VIT', price: 90000, stock: 100, catIdx: 5 }
  ];

  const medicines = await Promise.all(
    medicinesData.map((m, idx) => {
      // Rotate through the 10 seeded suppliers
      const supplierId = suppliers[idx % 10].id;
      const categoryId = categories[m.catIdx].id;

      // Expiry date set to 2 years in the future
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 2);

      return prisma.medicine.create({
        data: {
          medicineName: m.name,
          sku: m.sku,
          description: `High quality ${m.name} sourced from reliable distribution networks.`,
          price: m.price,
          stock: m.stock,
          expiredDate: expiry,
          categoryId: categoryId,
          supplierId: supplierId,
        },
      });
    })
  );

  console.log(`✅ Seeded ${medicines.length} medicines.`);
  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
