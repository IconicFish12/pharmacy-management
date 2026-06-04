import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.ts';
import { DatabaseService } from '../../../../../../src/database/database.service.ts';

describe('OrderDetailService (Unit Testing - White Box - Order Detail Module)', () => {
  let service: OrderDetailService;

  const mockDatabaseService = {
    orderDetail: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        { provide: DatabaseService, useValue: mockDatabaseService },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delete', () => {
    it('should delete order detail matching medicineId and orderId', async () => {
      mockDatabaseService.orderDetail.deleteMany.mockResolvedValue({ count: 1 });
      const result = await service.delete('med-123', 'order-123');
      expect(mockDatabaseService.orderDetail.deleteMany).toHaveBeenCalledWith({
        where: { AND: [{ medicineId: 'med-123' }, { orderId: 'order-123' }] },
      });
      expect(result).toEqual({ count: 1 });
    });
  });
});
