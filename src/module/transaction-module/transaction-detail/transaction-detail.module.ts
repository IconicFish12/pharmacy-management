import { Module } from '@nestjs/common';
import { TransactionDetailService } from './transaction-detail.service.js';
import { TransactionDetailController } from './transaction-detail.controller.js';
import { DatabaseModule } from '../../../database/database.module.js';
import { DatabaseService } from '../../../database/database.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionDetailController],
  providers: [TransactionDetailService, DatabaseService],
})
export class TransactionDetailModule {}
