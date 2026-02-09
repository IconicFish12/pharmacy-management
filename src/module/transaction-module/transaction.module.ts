import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service.js';
import { TransactionController } from './transaction.controller.js';
import { DatabaseModule } from '../../common/database/database.module.js';
import { DatabaseService } from '../../common/database/database.service.js';
import { MedicineModule } from '../medicine-module/medicine/medicine.module.js';

@Module({
  imports: [DatabaseModule, MedicineModule],
  controllers: [TransactionController],
  providers: [TransactionService, DatabaseService],
})
export class TransactionModule {}
