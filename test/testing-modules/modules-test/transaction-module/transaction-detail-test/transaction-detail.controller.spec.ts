import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { TransactionDetailController } from '../../../../../src/module/transaction-module/transaction-detail/transaction-detail.controller.ts';
import { TransactionDetailService } from '../../../../../src/module/transaction-module/transaction-detail/transaction-detail.service.ts';

describe('TransactionDetailController', () => {
  let controller: TransactionDetailController;

  const mockTransactionDetailService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionDetailController],
      providers: [
        {
          provide: TransactionDetailService,
          useValue: mockTransactionDetailService,
        },
      ],
    }).compile();

    controller = module.get<TransactionDetailController>(
      TransactionDetailController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
