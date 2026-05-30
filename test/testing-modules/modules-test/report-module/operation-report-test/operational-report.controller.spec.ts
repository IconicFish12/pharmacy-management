import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { OperationalReportController } from '../../../../../src/module/report-module/operational-report/operational-report.controller.ts';
import { OperationalReportService } from '../../../../../src/module/report-module/operational-report/operational-report.service.ts';

describe('OperationalReportController', () => {
  let controller: OperationalReportController;

  const mockOperationalReportService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationalReportController],
      providers: [
        { provide: OperationalReportService, useValue: mockOperationalReportService },
      ],
    }).compile();

    controller = module.get<OperationalReportController>(OperationalReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
