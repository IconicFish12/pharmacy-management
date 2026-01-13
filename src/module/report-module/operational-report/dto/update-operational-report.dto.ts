import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationalReportDto } from './create-operational-report.dto';

export class UpdateOperationalReportDto extends PartialType(CreateOperationalReportDto) {}
