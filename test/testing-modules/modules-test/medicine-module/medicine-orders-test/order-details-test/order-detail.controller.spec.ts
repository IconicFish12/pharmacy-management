import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it } from 'vitest';
import { OrderDetailController } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.controller.ts';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.ts';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;

  const mockOrderDetailService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [
        { provide: OrderDetailService, useValue: mockOrderDetailService },
      ],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
