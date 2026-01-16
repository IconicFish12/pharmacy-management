import { Module } from '@nestjs/common';
import { TransactionModuleService } from './transaction-module.service.js';
import { TransactionModuleController } from './transaction-module.controller.js';

@Module({
  controllers: [TransactionModuleController],
  providers: [TransactionModuleService],
})
export class TransactionModule{}
