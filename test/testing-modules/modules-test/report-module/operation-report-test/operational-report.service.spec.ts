import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OperationalReportService } from '../../../../../src/module/report-module/operational-report/operational-report.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';

describe('OperationalReportService', () => {
  let service: OperationalReportService;

  const mockDatabaseService = {
    medicine: {
      findMany: vi.fn(),
    },
    activityLog: {
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationalReportService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<OperationalReportService>(OperationalReportService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should return operational data and calculate stats', async () => {
      const mockMedicines = [
        {
          id: 'med-1',
          medicineName: 'Paracetamol',
          sku: 'MED-1234',
          stock: 10,
          price: 5000,
          expiredDate: new Date('2030-01-01'),
          category: { categoryName: 'Analgesic' },
          supplier: { companyName: 'PharmaCorp' },
        },
        {
          id: 'med-2',
          medicineName: 'Aspirin',
          sku: 'MED-5678',
          stock: 50,
          price: 8000,
          expiredDate: new Date('2020-01-01'),
          category: { categoryName: 'NSAID' },
          supplier: { companyName: 'PharmaCorp' },
        },
      ];

      const mockLogs = [
        {
          id: 'log-1',
          action: 'CREATE',
          createdAt: new Date(),
          employee: { name: 'Alice', empId: 'EMP-01', role: 'ADMIN' },
          resourceType: 'Medicine',
          resourceId: 'med-1',
        },
      ];

      mockDatabaseService.medicine.findMany.mockResolvedValue(mockMedicines);
      mockDatabaseService.activityLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getData({});

      expect(result).toHaveProperty('stats');
      expect(result.stats.totalMedicines).toBe(2);
      expect(result.stats.lowStockMedicines).toBe(1);
      expect(result.stats.expiredMedicines).toBe(1);
      expect(result.medicines).toEqual(mockMedicines);
      expect(result.activityLogs).toEqual(mockLogs);
    });
  });
});
