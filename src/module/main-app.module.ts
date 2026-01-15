import { Module } from '@nestjs/common';
import { MedicineMainModule } from './medicine-module/medicine-main.module';
import { ReportMainModule } from './report-module/report-main.module';
import { UserModule } from './user-module/user.module';
import { ActivityLogModule } from './logs-module/activity-log.module';
import { TransactionModule } from './transaction-module/transaction-module.module';
import { SupplierModule } from './supplier-module/supplier.module';
import { DatabaseModule } from '../common/database/database.module';

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
