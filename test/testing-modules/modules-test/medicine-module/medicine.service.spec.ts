import { Test, TestingModule } from '@nestjs/testing';
import { MedicineService } from 'src/module/medicine-module/medicine/medicine.service';
import { DatabaseService } from 'src/database/database.service';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';
import { SupplierService } from 'src/module/user-manage-module/supplier-module/supplier.service';
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
      create: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCategoryService = { findOne: jest.fn() };
  const mockSupplierService = { findOne: jest.fn() };
  const mockEventEmitter = { emit: jest.fn() };

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
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      name: 'Paracetamol',
      categoryId: 'cat-1',
      supplierId: 'sup-1',
      stock: 100,
    };

    it('should succeed create medicine data if medicine category and supplier is founded', async () => {
      categoryService.findOne = jest.fn().mockResolvedValue({ id: 'cat-1' });
      supplierService.findOne = jest.fn().mockResolvedValue({ id: 'sup-1' });
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
      categoryService.findOne = jest.fn().mockResolvedValue(null);
      supplierService.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  /*
  describe('findAll', () => {
    it('harus memicu event dan logger jika mendeteksi obat kedaluwarsa', async () => {
      mockPrisma.medicine.count.mockResolvedValue(5);

      // Menguji fungsionalitas pencarian dengan mock manual karena internal paginator adalah fungsi eksternal
      // Catatan: Pastikan helper penomoran halaman Anda terisolasi atau di-mock jika diperlukan
      mockPrisma.medicine.findMany = jest.fn().mockResolvedValue([]);
      mockPrisma.medicine.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(0);

      await service.findAll(1, 10);

      expect(mockPrisma.medicine.count).unquoted;
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'medicine.expired_detected',
        expect.any(Object),
      );
    });
  });
*/
  describe('findAll', () => {
    it('should trigger event and shown logs if detects expired medicines', async () => {
      mockPrisma.medicine.count.mockResolvedValue(5);
      mockPrisma.medicine.findMany = jest.fn().mockResolvedValue([]);

      await service.findAll(1, 10);

      expect(mockPrisma.medicine.count).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'medicine.expired_detected',
        expect.any(Object),
      );
    });

    it('should not triggering event if theres no expired medicine founded', async () => {
      mockPrisma.medicine.count.mockResolvedValue(0);
      mockPrisma.medicine.findMany = jest.fn().mockResolvedValue([]);

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
