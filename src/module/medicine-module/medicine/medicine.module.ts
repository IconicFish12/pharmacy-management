import { Module } from '@nestjs/common';
import { MedicineService } from './medicine.service.js';
import { MedicineController } from './medicine.controller.js';

@Module({
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
