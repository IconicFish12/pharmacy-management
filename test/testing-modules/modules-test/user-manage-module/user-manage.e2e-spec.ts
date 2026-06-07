import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.js';
import { DatabaseService } from '../../../../src/database/database.service.js';

describe('User Management Module (e2e)', () => {
  let app: INestApplication<App>;

  const mockDatabaseService = {
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

  describe('Employee Management', () => {
    it('/api/employees (GET) - lists employees', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/employees')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].name).toBe('John Doe');
    });
  });

  describe('Supplier Management', () => {
    it('/api/suppliers (GET) - lists suppliers', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/suppliers')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].companyName).toBe('PharmaCorp');
    });
  });
});
