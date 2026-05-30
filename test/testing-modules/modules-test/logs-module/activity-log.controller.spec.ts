import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { ActivityLogController } from '../../../../src/module/logs-module/activity-log.controller.ts';
import { ActivityLogService } from '../../../../src/module/logs-module/activity-log.service.ts';

describe('ActivityLogController', () => {
  let controller: ActivityLogController;

  const mockActivityLogService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogController],
      providers: [
        { provide: ActivityLogService, useValue: mockActivityLogService },
      ],
    }).compile();

    controller = module.get<ActivityLogController>(ActivityLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
