import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '../../../../../src/database/generated/prisma/client.ts'
import { MedicineOrderService } from '../../../../../src/module/medicine-module/medicine-order/medicine-order.service.ts';
import { DatabaseService } from '../../../../../src/database/database.service.ts';
import { NotFoundException } from '@nestjs/common';

// Mocking database service
const mockPrisma = mockDeep<PrismaClient>();

const mockDatabase = {
  $transaction: vi.fn().mockImplementation((callback) => {
    return callback(mockPrisma);
  }),
  medicineOrder: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUniqueOrThrow: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  medicine: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const mockEvent = {
  emit: vi.fn(),
};

// Arrange Mocking data
const orderId = 'f294d18a-34c1-4b68-be19-9bd6d42cc06b';

const mockOrderData = [
  {
    id: '009a8d21-2328-4387-81c9-9ab5bafd26b2',
    orderCode: 'ORD-01',
    orderDate: new Date(),
    employeeId: '3fae61e0-3ec2-4055-8989-99878e183a53',
    supplierId: '955ef9fd-0f71-44d6-b2bb-5f160573de1f',
    totalPrice: 2000000,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '71010638-0be6-49b2-9231-5db6cf3fa86f',
    orderCode: 'ORD-02',
    orderDate: new Date(),
    employeeId: '51b1e944-4942-44e7-b998-061daf4abedb',
    supplierId: 'd47e1464-7ad8-4e92-bce3-153eda2dedf0',
    totalPrice: 1550000,
    status: 'COMPLETED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3bf0ab31-d011-4c0f-9683-7f98852daf60',
    orderCode: 'ORD-03',
    orderDate: new Date(),
    employeeId: 'e77c5f75-8110-42f2-89e0-ec10d7f207eb',
    supplierId: '76b1670c-2acf-4aa8-ae7a-6be8c0308b10',
    totalPrice: 2000000,
    status: 'CANCELLED',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCreateDto = {
  orderDate: new Date(),
  employeeId: '11e76570-274f-40fe-9e85-4e50af6c6c24',
  supplierId: 'a103046c-2b2a-483e-9706-51e88752c7c3',
  status: 'PENDING',
  medicines: [
    { medicineId: 'med-uuid-1', quantity: 2, unitPrice: 50000 },
    { medicineId: 'med-uuid-2', quantity: 1, unitPrice: 100000 },
  ],
};

const mockUpdateDto = {
  orderCode: 'ORD-03',
  orderDate: new Date(),
  employeeId: '11e76570-274f-40fe-9e85-4e50af6c6c24',
  supplierId: '76b1670c-2acf-4aa8-ae7a-6be8c0308b10',
  totalPrice: 3555000,
  status: 'PENDING',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('MedicineOrderService', () => {
  let service: MedicineOrderService;
  let database: DatabaseService;
  let event: EventEmitter2;

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
    database = module.get<DatabaseService>(DatabaseService);
    event = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    vi.clearAllMocks();
    mockReset(mockPrisma);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('database should be defined', () => {
    expect(database).toBeDefined();
  });
 describe('Function create testing', () => {
    it('should succeed creating medicine order data with transaction calculations', async () => {
      mockPrisma.medicine.findUnique
        .mockResolvedValueOnce({ id: 'med-uuid-1', name: 'Paracetamol' } as any)
        .mockResolvedValueOnce({ id: 'med-uuid-2', name: 'Amoxicillin' } as any);

      const expectedTotal = 200000; 
      
      mockPrisma.medicineOrder.create.mockResolvedValue({
        id: 'new-order-uuid',
        totalPrice: expectedTotal,
        status: 'PENDING',
      } as any);

      const result = await service.create(mockCreateDto);

      expect(mockDatabase.$transaction).toHaveBeenCalled();
      expect(mockPrisma.medicine.findUnique).toHaveBeenCalledTimes(2);
      expect(mockPrisma.medicineOrder.create).toHaveBeenCalledWith({
        data: {
          orderDate: mockCreateDto.orderDate,
          status: mockCreateDto.status,
          orderCode: expect.any(String),
          totalPrice: expectedTotal,
          employee: { connect: { id: mockCreateDto.employeeId } },
          supplier: { connect: { id: mockCreateDto.supplierId } },
          orderDetails: {
            create: [
              { medicineId: 'med-uuid-1', quantity: 2, unitPrice: 50000, subtotal: 100000 },
              { medicineId: 'med-uuid-2', quantity: 1, unitPrice: 100000, subtotal: 100000 },
            ],
          },
        },
        include: { orderDetails: true },
      });

      expect(result).toHaveProperty('id', 'new-order-uuid');
      expect(result.totalPrice).toBe(expectedTotal);
    });

    it('should return NotFoundException when medicine data is not found', async () => {
      mockPrisma.medicine.findUnique.mockResolvedValue(null as any);

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new NotFoundException(`Medicine dengan ID med-uuid-1 tidak ditemukan.`),
      );

      expect(mockPrisma.medicineOrder.create).not.toHaveBeenCalled();
    });
  });  

  describe('Function findAll testing', () => {
    it('should been shown medicine order data', async () => {
      mockDatabase.medicineOrder.findMany.mockResolvedValue(mockOrderData);

      mockDatabase.medicineOrder.count.mockResolvedValue(3);

      const result = await service.findAll(10, 1);

      expect(mockDatabase.medicineOrder.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          include: {
            supplier: { omit: { id: true } },
            user: { omit: { id: true } },
          },
          omit: { employeeId: true, supplierId: true },
          take: 10,
          skip: 0,
        }),
      );

      expect(mockDatabase.medicineOrder.count).toHaveBeenCalled();

      expect(result.data).toEqual(mockOrderData);
    });
  });

  describe('Function findOne testing', () => {
    it('should been shown unique medicine order data object', async () => {
      mockDatabase.medicineOrder.findUniqueOrThrow.mockResolvedValue(
        mockOrderData[0],
      );

      const result = await service.findOne(
        '009a8d21-2328-4387-81c9-9ab5bafd26b2',
      );

      expect(mockDatabase.medicineOrder.findUniqueOrThrow).toHaveBeenCalledWith(
        {
          where: { id: mockOrderData[0].id },
          include: {
            _count: true,
            supplier: true,
            employee: true,
          },
        },
      );
    });

    it('should throw error id prisma error code P2025 is triggered (Record not found)', async () => {
      mockDatabase.medicineOrder.findUniqueOrThrow.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('Function update testing', () => {
    it('should been updating medicine order data using dto object', async () => {
      mockDatabase.medicineOrder.update.mockResolvedValue(mockUpdateDto);

      const result = await service.update(mockOrderData[2].id, mockUpdateDto);

      expect(mockDatabase.medicineOrder.update).toHaveBeenCalledWith({
        where: { id: mockOrderData[2].id },
        data: mockUpdateDto,
      });

      expect(result).toHaveProperty('status', 'PENDING');
    });
  });

  describe('Function delete testing', () => {
    it('should been deleting medicine order data from database', async () => {
      mockDatabase.medicineOrder.delete.mockResolvedValue(mockOrderData[1]);

      const result = await service.remove(mockOrderData[1].id);
      expect(mockDatabase.medicineOrder.delete).toHaveBeenCalledWith({
        where: { id: mockOrderData[1].id },
      });

      expect(result).toEqual(mockOrderData[1]);
    });
  });
});
