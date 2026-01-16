import { Module } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { FinancialReportController } from './financial-report.controller.js';

@Module({
  controllers: [FinancialReportController],
  providers: [FinancialReportService],
})
export class FinancialReportModule {}
