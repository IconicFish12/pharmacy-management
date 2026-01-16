import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialReportDto } from './create-financial-report.dto.js';

export class UpdateFinancialReportDto extends PartialType(CreateFinancialReportDto) {}
