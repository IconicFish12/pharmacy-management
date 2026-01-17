import { Module } from '@nestjs/common';
import { FinancialReportModule } from './financial-report/financial-report.module.js';
import { OperationalReportModule } from './operational-report/operational-report.module.js';
import { DatabaseModule } from '../../common/database/database.module.js';

@Module({
  imports: [FinancialReportModule, OperationalReportModule, DatabaseModule],
})
export class ReportMainModule {}
