import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { FinancialReportController } from '../../../../../src/module/report-module/financial-report/financial-report.controller.ts';
import { FinancialReportService } from '../../../../../src/module/report-module/financial-report/financial-report.service.ts';

describe('FinancialReportController', () => {
  let controller: FinancialReportController;

  const mockFinancialReportService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialReportController],
      providers: [
        { provide: FinancialReportService, useValue: mockFinancialReportService },
      ],
    }).compile();

    controller = module.get<FinancialReportController>(FinancialReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
