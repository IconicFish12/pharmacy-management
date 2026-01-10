import { Module } from '@nestjs/common';
import { TransactionModuleService } from './transaction-module.service';
import { TransactionModuleController } from './transaction-module.controller';

@Module({
  controllers: [TransactionModuleController],
  providers: [TransactionModuleService],
})
export class TransactionModuleModule {}
