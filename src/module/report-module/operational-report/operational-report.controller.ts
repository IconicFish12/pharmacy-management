import {
  Controller,
  Get,
  Query,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { OperationalReportService } from './operational-report.service.js';
import { ReportQueryDto, ExportQueryDto } from './dto/report-query.dto.js';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../../common/guards/roles.guard.js';
import { Role } from '../../../database/generated/prisma/enums.js';

@Controller('operational-report')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.OWNER, Role.ADMIN)
export class OperationalReportController {
  constructor(
    private readonly operationalReportService: OperationalReportService,
  ) {}

  @Get()
  async getData(@Query() query: ReportQueryDto) {
    return this.operationalReportService.getData(query);
  }

  @Get('export')
  async exportReport(
    @Query() query: ExportQueryDto,
    @Res() res: Response,
  ) {
    const { buffer, mimeType, filename } =
      await this.operationalReportService.exportReport(query);

    res.setHeader('Content-Type', mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"`,
    );
    res.status(HttpStatus.OK).send(buffer);
  }
}
