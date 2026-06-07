import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { FinancialReportService } from '../../../../../src/module/report-module/financial-report/financial-report.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';

describe('FinancialReportService', () => {
  let service: FinancialReportService;

  const mockDatabaseService = {
    transaction: {
      findMany: vi.fn(),
    },
    medicineOrder: {
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialReportService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<FinancialReportService>(FinancialReportService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getData', () => {
    it('should calculate revenue, expenses, net profit and transactions count', async () => {
      const mockTransactions = [
        {
          id: 't-1',
          totalPrice: 100000,
          transactionDate: new Date(),
          employee: { name: 'Alice' },
          transactionDetails: [],
        },
        {
          id: 't-2',
          totalPrice: 50000,
          transactionDate: new Date(),
          employee: { name: 'Bob' },
          transactionDetails: [],
        },
      ];

      const mockOrders = [
        {
          id: 'o-1',
          totalPrice: 80000,
          orderDate: new Date(),
          status: 'COMPLETED',
          employee: { name: 'Alice' },
          supplier: { companyName: 'SupCorp' },
          orderDetails: [],
        },
      ];

      mockDatabaseService.transaction.findMany.mockResolvedValue(
        mockTransactions,
      );
      mockDatabaseService.medicineOrder.findMany.mockResolvedValue(mockOrders);

      const result = await service.getData({});

      expect(result).toHaveProperty('summary');
      expect(result.summary.totalRevenue).toBe(150000);
      expect(result.summary.totalExpenses).toBe(80000);
      expect(result.summary.netProfit).toBe(70000);
      expect(result.summary.totalTransactionsCount).toBe(2);
      expect(result.summary.totalOrdersCount).toBe(1);
    });
  });
});
