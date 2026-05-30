import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { TransactionService } from '../../../../src/module/transaction-module/transaction.service.ts';
import { DatabaseService } from '../../../../src/database/database.service.ts';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service.ts';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockDatabaseService = {};
  const mockMedicineService = {};
  const mockEventEmitter = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: MedicineService, useValue: mockMedicineService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
