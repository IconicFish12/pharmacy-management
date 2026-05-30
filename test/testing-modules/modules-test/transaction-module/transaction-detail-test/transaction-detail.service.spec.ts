import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { TransactionDetailService } from '../../../../../src/module/transaction-module/transaction-detail/transaction-detail.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';

describe('TransactionDetailService', () => {
  let service: TransactionDetailService;

  const mockDatabaseService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionDetailService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<TransactionDetailService>(TransactionDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
