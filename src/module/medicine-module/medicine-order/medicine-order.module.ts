import { Module } from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service.js';
import { MedicineOrderController } from './medicine-order.controller.js';

@Module({
  controllers: [MedicineOrderController],
  providers: [MedicineOrderService],
})
export class MedicineOrderModule {}
