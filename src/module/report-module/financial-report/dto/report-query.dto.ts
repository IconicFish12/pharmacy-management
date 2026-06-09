import { IsOptional, IsString, IsIn } from 'class-validator';

export class ReportQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

export class ExportQueryDto extends ReportQueryDto {
  @IsString()
  @IsIn(['pdf', 'excel', 'csv'])
  format!: 'pdf' | 'excel' | 'csv';
}
