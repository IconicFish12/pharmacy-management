import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionModuleDto } from './create-transaction-module.dto.js';

export class UpdateTransactionModuleDto extends PartialType(CreateTransactionModuleDto) {}
