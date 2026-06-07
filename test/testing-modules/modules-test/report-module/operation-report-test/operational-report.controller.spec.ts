import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OperationalReportController } from '../../../../../src/module/report-module/operational-report/operational-report.controller.ts';
import { OperationalReportService } from '../../../../../src/module/report-module/operational-report/operational-report.service.ts';

describe('OperationalReportController', () => {
  let controller: OperationalReportController;
  let service: OperationalReportService;

  const mockOperationalReportService = {
    getData: vi.fn(),
    exportReport: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationalReportController],
      providers: [
        {
          provide: OperationalReportService,
          useValue: mockOperationalReportService,
        },
      ],
    }).compile();

    controller = module.get<OperationalReportController>(
      OperationalReportController,
    );
    service = module.get<OperationalReportService>(OperationalReportService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getData', () => {
    it('should return operational data', async () => {
      const mockResult = { stats: {}, medicines: [], activityLogs: [] };
      mockOperationalReportService.getData.mockResolvedValue(mockResult);

      const result = await controller.getData({});

      expect(service.getData).toHaveBeenCalledWith({});
      expect(result).toEqual(mockResult);
    });
  });

  describe('exportReport', () => {
    it('should set headers and send buffer', async () => {
      const mockBuffer = Buffer.from('mock-data');
      const mockExportResult = {
        buffer: mockBuffer,
        mimeType: 'text/csv',
        filename: 'report.csv',
      };
      mockOperationalReportService.exportReport.mockResolvedValue(
        mockExportResult,
      );

      const mockRes = {
        setHeader: vi.fn(),
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      } as any;

      await controller.exportReport({ format: 'csv' }, mockRes);

      expect(service.exportReport).toHaveBeenCalledWith({ format: 'csv' });
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'text/csv',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockBuffer);
    });
  });
});
