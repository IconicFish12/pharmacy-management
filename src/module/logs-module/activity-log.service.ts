import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from './dto/create-activity-log.dto.js';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto.js';

@Injectable()
export class ActivityLogService {
  create(createActivityLogDto: CreateActivityLogDto) {
    return 'This action adds a new activityLog';
  }

  findAll() {
    return `This action returns all activityLog`;
  }

  findOne(id: string) {
    return `This action returns a #${id} activityLog`;
  }

  update(id: string, updateActivityLogDto: UpdateActivityLogDto) {
    return `This action updates a #${id} activityLog`;
  }

  remove(id: string) {
    return `This action removes a #${id} activityLog`;
  }
}
