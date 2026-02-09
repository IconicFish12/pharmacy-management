import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { TransactionController } from './transaction.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';
import { MedicineModule } from '../medicine-module/medicine/medicine.module.js';
import { TransactionDetailModule } from './transaction-detail/transaction-detail.module.js';

@Module({
  imports: [DatabaseModule, MedicineModule, TransactionDetailModule],
  controllers: [TransactionController],
  providers: [TransactionService, DatabaseService],
})
export class TransactionModule {}
