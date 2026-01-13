import { Module } from '@nestjs/common';
import { OperationalReportService } from './operational-report.service';
import { OperationalReportController } from './operational-report.controller';

@Module({
  controllers: [OperationalReportController],
  providers: [OperationalReportService],
})
export class OperationalReportModule {}
