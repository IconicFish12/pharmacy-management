import { Module } from '@nestjs/common';
import { MedicineMainModule } from './medicine-module/medicine-main.module.js';
import { ReportMainModule } from './report-module/report-main.module.js';
import { UserModule } from './user-module/user.module.js';
import { ActivityLogModule } from './logs-module/activity-log.module.js';
import { TransactionModule } from './transaction-module/transaction-module.module.js';
import { SupplierModule } from './supplier-module/supplier.module.js';
import { DatabaseModule } from '../common/database/database.module.js';

@Module({
  imports: [
    DatabaseModule,
    MedicineMainModule, 
    ReportMainModule, 
    UserModule, 
    ActivityLogModule, 
    TransactionModule,
    SupplierModule
  ]
})
export class MainAppModule {}
