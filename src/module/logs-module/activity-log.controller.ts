import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service.js';

@Controller()
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  findAll(@Query() page?: number, @Query() perPage?: number) {
    return this.activityLogService.findAll(page, perPage);
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
