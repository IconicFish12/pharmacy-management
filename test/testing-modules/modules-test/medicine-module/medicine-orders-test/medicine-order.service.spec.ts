import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';
import { MedicineOrderService } from '../../../../../src/module/medicine-module/medicine-order/medicine-order.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';
import { NotFoundException } from '@nestjs/common';

const mockPrismaTx = {
  medicine: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  medicineOrder: {
    create: vi.fn(),
  },
};

const mockDatabase = {
  $transaction: vi.fn().mockImplementation((callback) => {
    return callback(mockPrismaTx);
  }),
  medicineOrder: {
    findMany: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

const mockEvent = {
  emit: vi.fn(),
};

describe('MedicineOrderService', () => {
  let service: MedicineOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineOrderService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
        {
          provide: EventEmitter2,
          useValue: mockEvent,
        },
      ],
    }).compile();

    service = module.get<MedicineOrderService>(MedicineOrderService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      supplierId: 'supplier-uuid',
      employeeId: 'employee-uuid',
      orderDate: new Date(),
      medicines: [
        {
          medicineId: 'med-123',
          quantity: 10,
          unitPrice: 15.5,
        },
      ],
    };

    it('should succeed creating medicine order data if medicine exists', async () => {
      const mockMedicine = {
        id: 'med-123',
        medicineName: 'Paracetamol',
        stock: 50,
      };

      const mockCreatedOrder = {
        id: 'order-123',
        orderCode: 'ORD-XYZ',
        totalPrice: 155.0,
        orderDetails: [
          {
            medicineId: 'med-123',
            quantity: 10,
            unitPrice: 15.5,
            subtotal: 155.0,
          },
        ],
      };

      mockPrismaTx.medicine.findUnique.mockResolvedValue(mockMedicine);
      mockPrismaTx.medicine.update.mockResolvedValue({
        ...mockMedicine,
        stock: 60,
      });
      mockPrismaTx.medicineOrder.create.mockResolvedValue(mockCreatedOrder);

      const result = await service.create(createDto as any);

      expect(mockPrismaTx.medicine.findUnique).toHaveBeenCalledWith({
        where: { id: 'med-123' },
      });
      expect(mockPrismaTx.medicine.update).toHaveBeenCalledWith({
        where: { id: 'med-123' },
        data: { stock: { increment: 10 } },
      });
      expect(mockPrismaTx.medicineOrder.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should throw NotFoundException if medicine does not exist', async () => {
      mockPrismaTx.medicine.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a medicine order with its relation', async () => {
      const mockResult = {
        id: 'order-123',
        orderCode: 'ORD-XYZ',
        supplier: { companyName: 'PT Pharma' },
        employee: { name: 'Jhon' },
      };
      mockDatabase.medicineOrder.findUniqueOrThrow.mockResolvedValue(
        mockResult,
      );

      const result = await service.findOne('order-123');

      expect(mockDatabase.medicineOrder.findUniqueOrThrow).toHaveBeenCalledWith(
        {
          where: { id: 'order-123' },
          include: {
            _count: true,
            supplier: true,
            employee: true,
          },
        },
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call prisma update to update medicine order', async () => {
      const updateDto = { status: 'COMPLETED' };
      const mockResult = { id: 'order-123', status: 'COMPLETED' };
      mockDatabase.medicineOrder.update.mockResolvedValue(mockResult);

      const result = await service.update('order-123', updateDto as any);

      expect(mockDatabase.medicineOrder.update).toHaveBeenCalledWith({
        where: { id: 'order-123' },
        data: updateDto,
      });
      expect(result).toEqual(mockResult);
    });
  });

  describe('remove', () => {
    it('should call prisma delete to delete medicine order', async () => {
      const mockResult = { id: 'order-123', orderCode: 'ORD-XYZ' };
      mockDatabase.medicineOrder.delete.mockResolvedValue(mockResult);

      const result = await service.remove('order-123');

      expect(mockDatabase.medicineOrder.delete).toHaveBeenCalledWith({
        where: { id: 'order-123' },
      });
      expect(result).toEqual(mockResult);
    });
  });
});
