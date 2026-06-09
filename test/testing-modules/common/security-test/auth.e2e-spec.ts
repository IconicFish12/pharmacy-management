import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../../../src/app.module.js';
import { DatabaseService } from '../../../../src/database/database.service.js';
import { AuthGuard } from '@nestjs/passport';

describe('Auth Module (e2e)', () => {
  let app: INestApplication<App>;

  const mockEmployee = {
    id: 'emp-123',
    name: 'John Doe',
    empId: 'EMP-012',
    email: 'johndoe@gmail.com',
    password: 'hashed-password',
    role: 'ADMIN',
    shift: 'DAY',
    status: 'ACTIVE',
    profileAvatar: 'avatar.png',
    salary: 2000000,
    startDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDatabaseService = {
    employee: {
      findUnique: vi.fn().mockResolvedValue(mockEmployee),
      update: vi.fn().mockResolvedValue(mockEmployee),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('local'))
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockEmployee;
          return true;
        },
      })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({
        canActivate: (context: any) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockEmployee;
          return true;
        },
      })
      .overrideProvider(DatabaseService)
      .useValue(mockDatabaseService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('/api/auth/sign-in (POST) - logs in and returns token with safe user details', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ email: 'johndoe@gmail.com', password: 'password' })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toEqual({
      id: 'emp-123',
      name: 'John Doe',
      empId: 'EMP-012',
      email: 'johndoe@gmail.com',
      role: 'ADMIN',
      shift: 'DAY',
      status: 'ACTIVE',
      profileAvatar: 'avatar.png',
    });
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('salary');
  });

  it('/api/auth/profile (GET) - returns safe profile info', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .expect(200);

    expect(response.body).toEqual({
      id: 'emp-123',
      name: 'John Doe',
      empId: 'EMP-012',
      email: 'johndoe@gmail.com',
      role: 'ADMIN',
      shift: 'DAY',
      status: 'ACTIVE',
      profileAvatar: 'avatar.png',
    });
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('salary');
  });
});
