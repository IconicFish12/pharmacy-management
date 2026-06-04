import { Module } from '@nestjs/common';
import { OperationalReportService } from './operational-report.service.js';
import { OperationalReportController } from './operational-report.controller.js';
import { DatabaseService } from '../../../database/database.service.js';

@Module({
  controllers: [OperationalReportController],
  providers: [OperationalReportService, DatabaseService],
})
export class OperationalReportModule {}

