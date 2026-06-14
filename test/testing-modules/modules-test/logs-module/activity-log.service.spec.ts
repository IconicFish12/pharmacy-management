import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { ActivityLogService } from '../../../../src/module/logs-module/activity-log.service.ts';
import { DatabaseService } from '../../../../src/database/database.service.ts';

describe('ActivityLogService (Unit Testing - White Box - Activity Log Module)', () => {
  let service: ActivityLogService;

  const mockPrisma = {
    activityLog: {
      create: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      delete: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        { provide: DatabaseService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an activity log with correct schema fields', async () => {
      const dto = {
        action: 'CREATE',
        employeeId: '6342b862-674e-4d86-8627-10729be1d4ac',
        resourceType: 'Medicine',
        resourceId: 'med-123',
        payloadData: { some: 'data' },
      };

      const mockCreated = { id: 'log-123', ...dto, createdAt: new Date() };
      mockPrisma.activityLog.create.mockResolvedValue(mockCreated);

      const result = await service.create(dto);
      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('findOne', () => {
    it('should retrieve a log with its employee relation', async () => {
      const logId = 'log-123';
      const mockResult = {
        id: logId,
        action: 'UPDATE',
        employeeId: 'emp-uuid',
        employee: { name: 'John Doe' },
      };
      mockPrisma.activityLog.findUniqueOrThrow.mockResolvedValue(mockResult);

      const result = await service.findOne(logId);
      expect(mockPrisma.activityLog.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: logId },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              empId: true,
              email: true,
              role: true,
              shift: true,
              status: true,
              profileAvatar: true,
            },
          },
        },
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should delete a log from the database', async () => {
      const logId = 'log-123';
      const mockDeleted = { id: logId, action: 'DELETE' };
      mockPrisma.activityLog.delete.mockResolvedValue(mockDeleted);

      const result = await service.remove(logId);
      expect(mockPrisma.activityLog.delete).toHaveBeenCalledWith({
        where: { id: logId },
      });
      expect(result).toEqual(mockDeleted);
    });
  });
});
