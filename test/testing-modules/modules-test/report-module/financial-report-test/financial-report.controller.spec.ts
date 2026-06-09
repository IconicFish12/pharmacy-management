import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { FinancialReportController } from '../../../../../src/module/report-module/financial-report/financial-report.controller.ts';
import { FinancialReportService } from '../../../../../src/module/report-module/financial-report/financial-report.service.ts';

describe('FinancialReportController', () => {
  let controller: FinancialReportController;
  let service: FinancialReportService;

  const mockFinancialReportService = {
    getData: vi.fn(),
    exportReport: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportController],
      providers: [
        {
          provide: FinancialReportService,
          useValue: mockFinancialReportService,
        },
      ],
    }).compile();

    controller = module.get<FinancialReportController>(
      FinancialReportController,
    );
    service = module.get<FinancialReportService>(FinancialReportService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return financial report data', async () => {
      const mockResult = {
        summary: {},
        incomeBreakdown: [],
        expenseBreakdown: [],
      };
      mockFinancialReportService.getData.mockResolvedValue(mockResult);

      const result = await controller.getData({});

      expect(service.getData).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResult);
    });
  });

  describe('exportReport', () => {
    it('should set headers and send file buffer', async () => {
      const mockBuffer = Buffer.from('financial-pdf');
      const mockExportResult = {
        buffer: mockBuffer,
        mimeType: 'application/pdf',
        filename: 'financial.pdf',
      };
      mockFinancialReportService.exportReport.mockResolvedValue(
        mockExportResult,
      );

      const mockRes = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      await controller.exportReport({ format: 'pdf' }, mockRes);

      expect(service.exportReport).toHaveBeenCalledWith({ format: 'pdf' });
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/pdf',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockBuffer);
    });
  });
});
