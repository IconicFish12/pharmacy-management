import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../src/common/guards/roles.guard.js';
import { DatabaseService } from '../src/database/database.service.js';

describe('Feature Modules (e2e)', () => {
  let app: INestApplication<App>;

  const mockDatabaseService = {
    medicine: {
      create: vi.fn().mockResolvedValue({
        id: 'med-123',
        medicineName: 'Amoxicillin',
        sku: 'SKU-90',
        stock: 50,
        price: 30000,
        expiredDate: new Date('2030-06-10'),
      }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'med-123',
          medicineName: 'Amoxicillin',
          sku: 'SKU-90',
          stock: 50,
          price: 30000,
          expiredDate: new Date('2030-06-10'),
        },
      ]),
      findUniqueOrThrow: vi.fn().mockResolvedValue({
        id: 'med-123',
        medicineName: 'Amoxicillin',
        sku: 'SKU-90',
        stock: 50,
        price: 30000,
        expiredDate: new Date('2030-06-10'),
      }),
      count: vi.fn().mockResolvedValue(1),
    },
    transaction: {
      create: vi.fn().mockResolvedValue({
        id: 'trans-123',
        transactionCode: 'TRC-123',
        totalPrice: 60000,
      }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'trans-123',
          transactionCode: 'TRC-123',
          totalPrice: 60000,
          employee: { name: 'Alice' },
          transactionDetails: [],
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    },
    employee: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'emp-123',
          name: 'John Doe',
          empId: 'EMP-012',
          email: 'johndoe@gmail.com',
          role: 'ADMIN',
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    },
    supplier: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'sup-123',
          companyName: 'PharmaCorp',
          phoneNumber: '12345678',
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    },
    activityLog: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'log-123',
          action: 'CREATE',
          employeeId: 'emp-123',
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Medicine Management Module', () => {
    it('/api/medicine-data/medicines (GET) - lists medicines', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/medicine-data/medicines')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].medicineName).toBe('Amoxicillin');
    });

    it('/api/medicine-data/medicines/:id (GET) - gets single medicine', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/medicine-data/medicines/med-123')
        .expect(200);

      expect(res.body).toHaveProperty('medicineName', 'Amoxicillin');
    });
  });

  describe('Transaction Module', () => {
    it('/api/finances/transactions (GET) - lists transactions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/finances/transactions')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].transactionCode).toBe('TRC-123');
    });
  });

  describe('Employee Management Module', () => {
    it('/api/employees (GET) - lists employees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/employees')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].name).toBe('John Doe');
    });
  });

  describe('Supplier Management Module', () => {
    it('/api/suppliers (GET) - lists suppliers', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/suppliers')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].companyName).toBe('PharmaCorp');
    });
  });

  describe('Activity Logs Module', () => {
    it('/api/activity-logs (GET) - lists activity logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/activity-logs')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].action).toBe('CREATE');
    });
  });
});
