import { forwardRef, Module } from '@nestjs/common';
import { MedicineModule } from './medicine/medicine.module.js';
import { MedicineCategoryModule } from './medicine-category/medicine-category.module.js';
import { MedicineOrderModule } from './medicine-order/medicine-order.module.js';
import { SupplierModule } from '../supplier-module/supplier.module.js';
import { DatabaseModule } from '../../common/database/database.module.js';

@Module({
  imports: [
    MedicineModule,
    MedicineCategoryModule,
    MedicineOrderModule,
    DatabaseModule,
  ],
  //   exports: [forwardRef(()=> SupplierModule)]
})
export class MedicineMainModule {}
