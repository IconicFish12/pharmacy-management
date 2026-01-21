import { Module } from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service.js';
import { MedicineOrderController } from './medicine-order.controller.js';
import { DatabaseModule } from '../../../common/database/database.module.js';
import { DatabaseService } from '../../../common/database/database.service.js';

@Module({
  controllers: [MedicineOrderController],
  providers: [MedicineOrderService, DatabaseService],
  imports: [DatabaseModule],
})
export class MedicineOrderModule {}
