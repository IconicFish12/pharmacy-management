import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { TransactionService } from '../../../../src/module/transaction-module/transaction.service.ts';
import { DatabaseService } from '../../../../src/database/database.service.ts';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service.ts';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';

describe('TransactionService (Unit Testing - White Box - Transaction Module)', () => {
  let service: TransactionService;

  const mockPrismaTx = {
    medicine: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
  };

  const mockDatabaseService = {
    $transaction: vi.fn().mockImplementation((callback) => callback(mockPrismaTx)),
    transaction: {
      findMany: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const mockMedicineService = {};
  const mockEventEmitter = {
    emit: vi.fn(),
  };

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

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      transactionDate: new Date(),
      cashReceived: 100000,
      employeeId: 'employee-uuid',
      medicines: [
        {
          medicineId: 'med-123',
          quantity: 2,
        },
      ],
    };

    it('should create a transaction if stock is available and cash is sufficient', async () => {
      const mockMedicine = {
        id: 'med-123',
        medicineName: 'Paracetamol',
        price: 30000,
        stock: 10,
      };

      const mockCreatedTransaction = {
        id: 'transaction-123',
        transactionCode: 'TRC-XYZ',
        totalPrice: 60000,
      };

      mockPrismaTx.medicine.findUnique.mockResolvedValue(mockMedicine);
      mockPrismaTx.medicine.update.mockResolvedValue({ ...mockMedicine, stock: 8 });
      mockPrismaTx.transaction.create.mockResolvedValue(mockCreatedTransaction);

      const result = await service.create(createDto);

      expect(mockPrismaTx.medicine.findUnique).toHaveBeenCalledWith({
        where: { id: 'med-123' },
      });
      expect(mockPrismaTx.medicine.update).toHaveBeenCalledWith({
        where: { id: 'med-123' },
        data: { stock: { decrement: 2 } },
      });
      expect(mockPrismaTx.transaction.create).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should throw BadRequestException if cash received is less than total price', async () => {
      const mockMedicine = {
        id: 'med-123',
        medicineName: 'Paracetamol',
        price: 60000, // 2 x 60000 = 120000 > cashReceived(100000)
        stock: 10,
      };

      mockPrismaTx.medicine.findUnique.mockResolvedValue(mockMedicine);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      const mockMedicine = {
        id: 'med-123',
        medicineName: 'Paracetamol',
        price: 30000,
        stock: 1, // stock is 1, quantity requested is 2
      };

      mockPrismaTx.medicine.findUnique.mockResolvedValue(mockMedicine);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a transaction with details', async () => {
      const mockTransaction = {
        id: 'trans-123',
        transactionCode: 'TRC-ABC',
        totalPrice: 50000,
      };
      mockDatabaseService.transaction.findUniqueOrThrow.mockResolvedValue(mockTransaction);

      const result = await service.findOne('trans-123');

      expect(mockDatabaseService.transaction.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'trans-123' },
        include: {
          _count: true,
          transactionDetails: true,
          employee: true,
        },
      });
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('remove', () => {
    it('should delete transaction from database', async () => {
      const mockDeleted = { id: 'trans-123', transactionCode: 'TRC-ABC' };
      mockDatabaseService.transaction.delete.mockResolvedValue(mockDeleted);

      const result = await service.remove('trans-123');

      expect(mockDatabaseService.transaction.delete).toHaveBeenCalledWith({
        where: { id: 'trans-123' },
      });
      expect(result).toEqual(mockDeleted);
    });
  });
});
