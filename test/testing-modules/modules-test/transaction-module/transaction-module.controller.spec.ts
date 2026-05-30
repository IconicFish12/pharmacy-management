import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { TransactionController } from '../../../../src/module/transaction-module/transaction.controller.ts';
import { TransactionService } from '../../../../src/module/transaction-module/transaction.service.ts';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
