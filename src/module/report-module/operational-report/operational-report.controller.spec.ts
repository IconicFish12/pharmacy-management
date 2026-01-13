import { Test, TestingModule } from '@nestjs/testing';
import { OperationalReportController } from './operational-report.controller';
import { OperationalReportService } from './operational-report.service';

describe('OperationalReportController', () => {
  let controller: OperationalReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationalReportController],
      providers: [OperationalReportService],
    }).compile();

    controller = module.get<OperationalReportController>(OperationalReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
