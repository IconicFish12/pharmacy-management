import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.ts';
import { DatabaseService } from '../../../../../../src/database/database.service.ts';

describe('OrderDetailService', () => {
  let service: OrderDetailService;

  const mockDatabaseService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
