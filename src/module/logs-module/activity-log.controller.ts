import {
  Controller,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service.js';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/guards/roles.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Role } from '../../database/generated/prisma/enums.js';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.OWNER)
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.activityLogService.findAll(page!, perPage!);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityLogService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityLogService.remove(id);
  }
}
