import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service.js';
import { OrderDetailController } from './order-detail.controller.js';
import { DatabaseModule } from '../../../../database/database.module.js';
import { DatabaseService } from '../../../../database/database.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderDetailController],
  providers: [OrderDetailService, DatabaseService],
})
export class OrderDetailModule {}
