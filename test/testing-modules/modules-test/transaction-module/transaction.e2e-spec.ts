import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.js';
import { DatabaseService } from '../../../../src/database/database.service.js';

describe('Transaction Module (e2e)', () => {
  let app: INestApplication<App>;

  const mockDatabaseService = {
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

  describe('Transaction Management', () => {
    it('/api/finances/transactions (GET) - lists transactions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/finances/transactions')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].transactionCode).toBe('TRC-123');
    });
  });
});
