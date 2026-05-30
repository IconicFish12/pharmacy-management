import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { OperationalReportService } from '../../../../../src/module/report-module/operational-report/operational-report.service.ts';

describe('OperationalReportService', () => {
  let service: OperationalReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationalReportService],
    }).compile();

    service = module.get<OperationalReportService>(OperationalReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
