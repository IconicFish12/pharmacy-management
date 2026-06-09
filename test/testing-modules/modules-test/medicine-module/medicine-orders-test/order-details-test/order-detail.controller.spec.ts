import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OrderDetailController } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.controller.ts';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.ts';
import { AuthGuard } from '@nestjs/passport';

describe('OrderDetailController (Integration Testing - Gray Box)', () => {
  let controller: OrderDetailController;
  let service: OrderDetailService;

  const mockOrderDetailService = {
    findAll: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [
        { provide: OrderDetailService, useValue: mockOrderDetailService },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
    service = module.get<OrderDetailService>(OrderDetailService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should forward parameters to OrderDetailService.findAll', async () => {
      mockOrderDetailService.findAll.mockResolvedValue({ data: [] });
      const result = await controller.findAll(1, 10);
      expect(service.findAll).toHaveBeenCalledWith(10, 1);
      expect(result).toEqual({ data: [] });
    });
  });

  describe('DELETE /', () => {
    it('should forward to service.delete with medicine-id and order-id', async () => {
      mockOrderDetailService.delete.mockResolvedValue({ count: 1 });
      const result = await controller.delete('med-123', 'order-123');
      expect(service.delete).toHaveBeenCalledWith('med-123', 'order-123');
      expect(result).toEqual({ count: 1 });
    });
  });
});
