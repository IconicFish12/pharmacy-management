import { Test, TestingModule } from '@nestjs/testing';
import {
  vi,
  beforeEach,
  afterEach,
  afterAll,
  expect,
  describe,
  it,
} from 'vitest';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../../src/common/guards/roles.guard.ts';
import { EmployeeController } from '../../../../../src/module/user-manage-module/employee-module/employee.controller.ts';
import { EmployeeService } from '../../../../../src/module/user-manage-module/employee-module/employee.service.ts';
import request from 'supertest';

describe('EmployeeController Integration Testing', () => {
  let app: INestApplication;

  const mockEmployeeService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // ✅ Wrap semua it() dalam describe
  describe('POST /', () => {
    it('should trigger service create', async () => {
      const payload = { email: 'test@mail.com', password: 'password' };
      mockEmployeeService.create.mockResolvedValue({ id: '1', ...payload });

      const response = await request(app.getHttpServer())
        .post('/')
        .send(payload)
        .expect(201);

      expect(mockEmployeeService.create).toHaveBeenCalled();
      expect(response.body.id).toBe('1');
    });
  });

  describe('GET /', () => {
    it('should trigger service findAll', async () => {
      mockEmployeeService.findAll.mockResolvedValue({ data: [], meta: {} });

      const response = await request(app.getHttpServer())
        .get('/')
        .query({ page: 1, perPage: 10 })
        .expect(200);

      expect(mockEmployeeService.findAll).toHaveBeenCalled();
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('GET /:id', () => {
    it('should trigger service findOne', async () => {
      mockEmployeeService.findOne.mockResolvedValue({ id: '1' });

      const response = await request(app.getHttpServer()).get('/1').expect(200);

      expect(mockEmployeeService.findOne).toHaveBeenCalledWith('1');
      expect(response.body.id).toBe('1');
    });
  });

  describe('PATCH /:id', () => {
    it('should trigger service update', async () => {
      const payload = { password: 'new' };
      mockEmployeeService.update.mockResolvedValue({ id: '1' });

      await request(app.getHttpServer()).patch('/1').send(payload).expect(200);

      expect(mockEmployeeService.update).toHaveBeenCalled();
    });
  });

  describe('DELETE /:id', () => {
    it('should trigger service remove', async () => {
      mockEmployeeService.remove.mockResolvedValue({ id: '1' });

      await request(app.getHttpServer()).delete('/1').expect(200);

      expect(mockEmployeeService.remove).toHaveBeenCalledWith('1');
    });
  });
});
