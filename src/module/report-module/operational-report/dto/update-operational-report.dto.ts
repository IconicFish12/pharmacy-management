import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationalReportDto } from './create-operational-report.dto.js';

export class UpdateOperationalReportDto extends PartialType(CreateOperationalReportDto) {}
