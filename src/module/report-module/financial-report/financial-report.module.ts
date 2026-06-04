import { Module } from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { FinancialReportController } from './financial-report.controller.js';
import { DatabaseService } from '../../../database/database.service.js';

@Module({
  controllers: [FinancialReportController],
  providers: [FinancialReportService, DatabaseService],
})
export class FinancialReportModule {}

