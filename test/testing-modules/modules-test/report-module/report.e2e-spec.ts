import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.js';
import { DatabaseService } from '../../../../src/database/database.service.js';

describe('Report Module (e2e)', () => {
  let app: INestApplication<App>;

  const mockDatabaseService = {
    medicine: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 'med-1',
          medicineName: 'Paracetamol',
          sku: 'MED-123',
          stock: 10,
          price: 5000,
          expiredDate: new Date('2030-01-01'),
          category: { categoryName: 'Analgesic' },
          supplier: { companyName: 'PharmaCorp' },
        },
      ]),
    },
    activityLog: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    transaction: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 't-1',
          totalPrice: 100000,
          transactionDate: new Date(),
          employee: { name: 'Alice' },
          transactionDetails: [],
        },
      ]),
    },
    medicineOrder: {
      findMany: vi.fn().mockResolvedValue([]),
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

  describe('Operational Report', () => {
    it('/operational-report (GET) - JSON data', async () => {
      const response = await request(app.getHttpServer())
        .get('/operational-report')
        .expect(200);

      expect(response.body).toHaveProperty('stats');
      expect(response.body).toHaveProperty('medicines');
      expect(response.body.medicines).toHaveLength(1);
      expect(response.body.medicines[0].medicineName).toBe('Paracetamol');
    });

    it('/operational-report/export (GET) - CSV export', async () => {
      const response = await request(app.getHttpServer())
        .get('/operational-report/export?format=csv')
        .expect(200);

      expect(response.header['content-type']).toContain('text/csv');
      expect(response.text).toContain('=== APOTHECARY OPERATIONAL REPORT ===');
      expect(response.text).toContain('Paracetamol');
    });
  });

  describe('Financial Report', () => {
    it('/financial-report (GET) - JSON data', async () => {
      const response = await request(app.getHttpServer())
        .get('/financial-report')
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary.totalRevenue).toBe(100000);
      expect(response.body.incomeBreakdown).toHaveLength(1);
    });

    it('/financial-report/export (GET) - PDF export', async () => {
      const response = await request(app.getHttpServer())
        .get('/financial-report/export?format=pdf')
        .expect(200);

      expect(response.header['content-type']).toContain('application/pdf');
    });
  });
});
