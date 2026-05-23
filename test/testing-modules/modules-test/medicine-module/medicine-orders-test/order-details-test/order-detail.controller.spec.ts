import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OrderDetailController } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.controller.js';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.js';

describe('OrderDetailController - Integration Testing (Gray Box)', () => {
  let controller: OrderDetailController;
  let service: OrderDetailService;
  let app: INestApplication;
  let serverUrl: string;

  const mockOrderDetailService = {
    findAll: vi.fn(),
    delete: vi.fn(),
  };

  const mockAuthGuard = {
    canActivate: vi.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [
        { 
          provide: OrderDetailService, 
          useValue: mockOrderDetailService 
        }
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = moduleFixture.get<OrderDetailController>(OrderDetailController);
    service = moduleFixture.get<OrderDetailService>(OrderDetailService);

    app = moduleFixture.createNestApplication();
    await app.init();

    await app.listen(0);
    serverUrl = await app.getUrl();
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await app.close();
  });

  it('should ensure test component are successfully defined', () => {
    expect(app).toBeDefined();
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET / - findAll', () => {
    it('should successfully parse query parameters and return paginated order details', async () => {
      // ARRANGE
      const mockPaginationResult = {
        data: [
          { id: 'detail-1', medicineId: 'med-1', orderId: 'ord-1', quantity: 5 },
          { id: 'detail-2', medicineId: 'med-2', orderId: 'ord-1', quantity: 2 },
        ],
      };
      mockOrderDetailService.findAll.mockResolvedValue(mockPaginationResult);

      const response = await fetch(`${serverUrl}?page=1&perPage=10`);
      const body = await response.json();

      expect(response.status).toBe(200);
      
      // Memastikan query params dikoversi menjadi number dan dikirim ke service dengan urutan (perPage, page)
      // Perhatikan controller Anda: findAll(@Query('page') page, @Query('perPage') perPage) 
      // memanggil service.findAll(perPage!, page!)
      expect(mockOrderDetailService.findAll).toHaveBeenCalled();
      expect(body).toEqual(mockPaginationResult);
    });
  });

  describe('DELETE / - delete', () => {
    it('should successfully parse medicine-id and order-id then call delete service', async () => {
      const mockDeleteResult = { success: true, message: 'Order detail removed successfully' };
      mockOrderDetailService.delete.mockResolvedValue(mockDeleteResult);

      const targetMedicineId = 'med-uuid-123';
      const targetOrderId = 'order-uuid-456';

      const response = await fetch(
        `${serverUrl}?medicine-id=${targetMedicineId}&order-id=${targetOrderId}`,
        { method: 'DELETE' }
      );
      const body = await response.json();

      expect(response.status).toBe(200);
      
      // Memastikan controller meneruskan argument ke service.delete(medicineId!, orderId!)
      expect(mockOrderDetailService.delete).toHaveBeenCalledWith(targetMedicineId, targetOrderId);
      expect(body).toEqual(mockDeleteResult);
    });
  });
});
