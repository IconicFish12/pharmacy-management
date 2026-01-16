import { Injectable } from '@nestjs/common';
import { CreateTransactionModuleDto } from './dto/create-transaction-module.dto.js';
import { UpdateTransactionModuleDto } from './dto/update-transaction-module.dto.js';

@Injectable()
export class TransactionModuleService {
  create(createTransactionModuleDto: CreateTransactionModuleDto) {
    return 'This action adds a new transactio.module.js';
  }

  findAll() {
    return `This action returns all transactionModule`;
  }

  findOne(id: string) {
    return `This action returns a #${id} transactionModule`;
  }

  update(id: string, updateTransactionModuleDto: UpdateTransactionModuleDto) {
    return `This action updates a #${id} transactionModule`;
  }

  remove(id: string) {
    return `This action removes a #${id} transactionModule`;
  }
}
