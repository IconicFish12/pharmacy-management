import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.js';
import { DatabaseService } from '../../../../src/database/database.service.js';

describe('Activity Logs Module (e2e)', () => {
  let app: INestApplication<App>;

  const mockDatabaseService = {
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

  describe('Activity Logs Management', () => {
    it('/api/activity-logs (GET) - lists activity logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/activity-logs')
        .expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body.data[0].action).toBe('CREATE');
    });
  });
});
