import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.js';
import { DatabaseService } from '../../../../src/database/database.service.js';

describe('Medicine Module (e2e)', () => {
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

  describe('Medicine Management', () => {
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
});
