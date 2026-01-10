import { Test, TestingModule } from '@nestjs/testing';
import { MedicineOrderController } from './medicine-order.controller';
import { MedicineOrderService } from './medicine-order.service';

describe('MedicineOrderController', () => {
  let controller: MedicineOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineOrderController],
      providers: [MedicineOrderService],
    }).compile();

    controller = module.get<MedicineOrderController>(MedicineOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
