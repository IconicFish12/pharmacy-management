import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FinancialReportService } from './financial-report.service.js';
import { ReportQueryDto, ExportQueryDto } from './dto/report-query.dto.js';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Role } from '../../../database/generated/prisma/enums.js';

@Controller('financial-report')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
export class FinancialReportController {
  constructor(
    private readonly financialReportService: FinancialReportService,
  ) {}

  @Get()
  async getData(@Query() query: ReportQueryDto) {
    return this.financialReportService.getData(query);
  }

  @Get('export')
  async exportReport(@Query() query: ExportQueryDto, @Res() res: Response) {
    const { buffer, mimeType, filename } =
      await this.financialReportService.exportReport(query);

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HttpStatus.OK).send(buffer);
  }
}
