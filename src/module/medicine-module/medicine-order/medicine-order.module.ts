import { Module } from '@nestjs/common';
import { MedicineOrderService } from './medicine-order.service';
import { MedicineOrderController } from './medicine-order.controller';

@Module({
  controllers: [MedicineOrderController],
  providers: [MedicineOrderService],
})
export class MedicineOrderModule {}
