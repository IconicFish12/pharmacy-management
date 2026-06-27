import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service.ts';
import { DatabaseService } from '../../../../src/database/database.service.ts';
import { MedicineCategoryService } from '../../../../src/module/medicine-module/medicine-category/medicine-category.service.ts';
import { SupplierService } from '../../../../src/module/user-manage-module/supplier-module/supplier.service.ts';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotFoundException } from '@nestjs/common';

describe('MedicineService (Unit Testing - White Box - Medicine Module)', () => {
  let service: MedicineService;
  let prisma: DatabaseService;
  let categoryService: MedicineCategoryService;
  let supplierService: SupplierService;
  let eventEmitter: EventEmitter2;

  const mockPrisma = {
    medicine: {
      create: vi.fn(),
      count: vi.fn(),
      findUniqueOrThrow: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  };

  const mockCategoryService = { findOne: vi.fn() };
  const mockSupplierService = { findOne: vi.fn() };
  const mockEventEmitter = { emit: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineService,
        { provide: DatabaseService, useValue: mockPrisma },
        { provide: MedicineCategoryService, useValue: mockCategoryService },
        { provide: SupplierService, useValue: mockSupplierService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<MedicineService>(MedicineService);
    prisma = module.get<DatabaseService>(DatabaseService);
    categoryService = module.get<MedicineCategoryService>(
      MedicineCategoryService,
    );
    supplierService = module.get<SupplierService>(SupplierService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      medicineName: 'Paracetamol',
      sku: 'SKU-PARA-100',
      price: 5000.0,
      expiredDate: new Date('2030-01-01'),
      categoryId: 'cat-1',
      supplierId: 'sup-1',
      stock: 100,
      description: 'Pain reliever',
    };

    it('should succeed create medicine data if medicine category and supplier is founded', async () => {
      categoryService.findOne = vi.fn().mockResolvedValue({ id: 'cat-1' });
      supplierService.findOne = vi.fn().mockResolvedValue({ id: 'sup-1' });
      mockPrisma.medicine.create.mockResolvedValue({
        id: 'med-1',
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(categoryService.findOne).toHaveBeenCalledWith('cat-1');
      expect(supplierService.findOne).toHaveBeenCalledWith('sup-1');
      expect(mockPrisma.medicine.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'med-1');
    });

    it('should throw NotFoundException if medicine category and supplier data is not found', async () => {
      categoryService.findOne = vi.fn().mockResolvedValue(null);
      supplierService.findOne = vi.fn().mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should trigger event and shown logs if detects expired medicines', async () => {
      mockPrisma.medicine.count.mockResolvedValue(5);
      mockPrisma.medicine.findMany = vi.fn().mockResolvedValue([]);

      await service.findAll(1, 10);

      expect(mockPrisma.medicine.count).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'medicine.expired_detected',
        expect.any(Object),
      );
    });

    it('should not triggering event if theres no expired medicine founded', async () => {
      mockPrisma.medicine.count.mockResolvedValue(0);
      mockPrisma.medicine.findMany = vi.fn().mockResolvedValue([]);

      await service.findAll(1, 10);

      expect(eventEmitter.emit).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a medicine data with its relation', async () => {
      const mockResult = {
        id: 'med-123',
        name: 'Amoxicillin',
        category: { name: 'Antibiotik' },
        supplier: { name: 'PT Pharma' },
      };
      mockPrisma.medicine.findUniqueOrThrow.mockResolvedValue(mockResult);

      const result = await service.findOne('med-123');

      expect(mockPrisma.medicine.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'med-123' },
        include: { _count: true, category: true, supplier: true },
      });
      expect(result).toEqual(mockResult);
    });

    it('should throw error id prisma error code P2025 is triggered (Record not found)', async () => {
      mockPrisma.medicine.findUniqueOrThrow.mockRejectedValue(
        new Error('Record not found'),
      );

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Record not found',
      );
    });
  });

  describe('update', () => {
    it('should updating medicine data using dto object', async () => {
      const id = 'med-123';
      const updateDto = { stock: 80 };
      const mockUpdatedResult = { id, name: 'Amoxicillin', stock: 80 };

      mockPrisma.medicine.update.mockResolvedValue(mockUpdatedResult);

      const result = await service.update(id, updateDto);

      expect(mockPrisma.medicine.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toHaveProperty('stock', 80);
    });

    it('should accept boundary stock value of 0 as valid update', async () => {
      const id = 'med-123';
      const updateDto = { stock: 0 };
      const mockUpdatedResult = { id, name: 'Amoxicillin', stock: 0 };

      mockPrisma.medicine.update.mockResolvedValue(mockUpdatedResult);

      const result = await service.update(id, updateDto);

      expect(mockPrisma.medicine.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
      });
      expect(result).toHaveProperty('stock', 0);
    });
  });

  describe('remove', () => {
    it('should call and execute delete function from service', async () => {
      const id = 'med-123';
      const mockDeletedResult = { id, name: 'Amoxicillin' };

      mockPrisma.medicine.delete.mockResolvedValue(mockDeletedResult);

      const result = await service.remove(id);

      expect(mockPrisma.medicine.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockDeletedResult);
    });
  });
});
