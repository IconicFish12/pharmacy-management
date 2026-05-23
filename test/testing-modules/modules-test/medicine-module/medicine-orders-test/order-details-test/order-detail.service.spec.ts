import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { OrderDetailService } from '../../../../../../src/module/medicine-module/medicine-order/order-detail/order-detail.service.ts';
import { DatabaseService } from '../../../../../../src/database/database.service.ts';

const mockOrderDetail = [
    {
        orderId: '06da66d6-22d7-4040-8186-1961144d35a3',
        medicineId: '65125cc7-5f11-423d-ad43-0dd33a677288',
        quantity: 37,
        unitPrice: 20000,
        subtotal: this.quantity * this.unitPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        orderId: 'c325b2ae-accc-485c-95e9-ee18802080ea',
        medicineId: '3850d7e9-4ab3-4794-9e6d-d0aafe9aded2',
        quantity: 56,
        unitPrice: 25000,
        subtotal: this.quantity * this.unitPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
] 

describe('OrderDetailService', () => {
  let service: OrderDetailService;
  let database: DatabaseService;

  const mockDatabase = {
    orderDetail: {
      findMany: vi.fn(),
      count: vi.fn(),
      deleteMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderDetailService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    service = module.get<OrderDetailService>(OrderDetailService);
    database = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('database should be defined', () => {
      expect(database).toBeDefined();
  })

  describe('Function findAll testing', () => {
      it('should been shown data medicine order detail', async () => {
          mockDatabase.orderDetail.findMany.mockResolvedValue(mockOrderDetail);
          mockDatabase.orderDetail.count.mockResolvedValue(2);

          const result = await service.findAll(10, 1);

          expect(mockDatabase.orderDetail.findMany).toHaveBeenCalledWith(
              expect.objectContaining({
                orderBy: { createdAt: 'desc' },
        include: {
          order: { omit: { id: true } },
          medicine: { omit: { id: true } },
        },
        take: 10,
        skip: 0

              })
          )

      expect(result.data).toEqual(mockOrderDetail);
      })
  });

  describe('Fucntion delete testing', () => {
      it('should been deleting medicine order detail data from database', async () => {
          mockDatabase.orderDetail.deleteMany.mockResolvedValue(mockOrderDetail[0])

          const result = await service.delete(mockOrderDetail[0].medicineId, mockOrderDetail[0].orderId);

          expect(mockDatabase.orderDetail.deleteMany).toHaveBeenCalledWith({
              where: {
                  AND: [
                      {
                          medicineId: mockOrderDetail[0].medicineId
                      },
                      {
                          orderId: mockOrderDetail[0].orderId
                      }
                  ]
              }
          })

          expect(result).toEqual(mockOrderDetail[0])
      })
  })
});
