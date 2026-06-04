import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { ActivityLogController } from '../../../../src/module/logs-module/activity-log.controller.ts';
import { ActivityLogService } from '../../../../src/module/logs-module/activity-log.service.ts';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.ts';

describe('ActivityLogController (Integration Testing - Gray Box)', () => {
  let controller: ActivityLogController;
  let service: ActivityLogService;

  const mockActivityLogService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogController],
      providers: [
        { provide: ActivityLogService, useValue: mockActivityLogService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ActivityLogController>(ActivityLogController);
    service = module.get<ActivityLogService>(ActivityLogService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should call service findAll with page and perPage', async () => {
      mockActivityLogService.findAll.mockResolvedValue({ data: [], meta: {} });
      const result = await controller.findAll(1, 10);
      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({ data: [], meta: {} });
    });
  });

  describe('GET /:id', () => {
    it('should call service findOne with id', async () => {
      const mockResult = { id: 'log-123', action: 'CREATE' };
      mockActivityLogService.findOne.mockResolvedValue(mockResult);
      const result = await controller.findOne('log-123');
      expect(service.findOne).toHaveBeenCalledWith('log-123');
      expect(result).toEqual(mockResult);
    });
  });

  describe('DELETE /:id', () => {
    it('should call service remove with id', async () => {
      const mockResult = { id: 'log-123', action: 'DELETE' };
      mockActivityLogService.remove.mockResolvedValue(mockResult);
      const result = await controller.remove('log-123');
      expect(service.remove).toHaveBeenCalledWith('log-123');
      expect(result).toEqual(mockResult);
    });
  });
});
