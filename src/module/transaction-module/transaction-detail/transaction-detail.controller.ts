import { Controller } from '@nestjs/common';
import { TransactionDetailService } from './transaction-detail.service.js';

@Controller()
export class TransactionDetailController {
  constructor(
    private readonly transactionDetailService: TransactionDetailService,
  ) {}
}
