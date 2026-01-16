import { Module } from '@nestjs/common';
import { OperationalReportService } from './operational-report.service.js';
import { OperationalReportController } from './operational-report.controller.js';

@Module({
  controllers: [OperationalReportController],
  providers: [OperationalReportService],
})
export class OperationalReportModule {}
