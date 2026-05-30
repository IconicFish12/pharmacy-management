import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { ActivityLogService } from '../../../../src/module/logs-module/activity-log.service.ts';
import { DatabaseService } from '../../../../src/database/database.service.ts';

describe('ActivityLogService', () => {
  let service: ActivityLogService;

  const mockDatabaseService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
