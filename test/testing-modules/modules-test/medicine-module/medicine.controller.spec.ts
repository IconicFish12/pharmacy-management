import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { MedicineController } from '../../../../src/module/medicine-module/medicine/medicine.controller.ts';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service.ts';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard.ts';

describe('MedicineController (Integration Testing - Gray Box)', () => {
  let controller: MedicineController;
  let service: MedicineService;

  const mockMedicineService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const mockAuthGuard = { canActivate: () => true };
  const mockRolesGuard = { canActivate: () => true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineController],
      providers: [
        {
          provide: MedicineService,
          useValue: mockMedicineService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<MedicineController>(MedicineController);
    service = module.get<MedicineService>(MedicineService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /', () => {
    it('should forward dto object input to MedicineService.create', async () => {
      const dto = {
        medicineName: 'Amoxicillin',
        sku: 'SKU-90',
        categoryId: 'cat-2',
        supplierId: 'sup-2',
        stock: 50,
        price: 30000,
        expiredDate: '2026-06-10',
      };
      mockMedicineService.create.mockResolvedValue({ id: 'med-2', ...dto });

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', 'med-2');
    });
  });

  describe('GET /', () => {
    it('should extract query patameter and call function MedicineService.findAll', async () => {
      const page = 1;
      const perPage = 10;
      mockMedicineService.findAll.mockResolvedValue({ data: [], meta: {} });

      const result = await controller.findAll(page, perPage);

      expect(service.findAll).toHaveBeenCalledWith(page, perPage);
      expect(result).toHaveProperty('data');
    });
  });

  describe('GET /:id', () => {
    it('should send id parameter to service', async () => {
      const id = 'uuid-string';
      mockMedicineService.findOne.mockResolvedValue({
        id,
        medicineName: 'Obat Batuk',
      });

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('medicineName', 'Obat Batuk');
    });
  });

  describe('PATCH /:id', () => {
    it('should receive parameter and send object dto to MedicineService.update', async () => {
      const id = 'med-uuid-123';
      const updateDto = { stock: 150 };
      const mockUpdatedResult = {
        id,
        medicineName: 'Amoxicillin',
        sku: 'SKU-90',
        categoryId: 'cat-2',
        supplierId: 'sup-2',
        stock: 150,
        price: 30000,
        expiredDate: '2026-06-10',
      };

      mockMedicineService.update.mockResolvedValue(mockUpdatedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toHaveProperty('stock', 150);
      expect(result).toHaveProperty('id', id);
    });
  });

  describe('DELETE /:id', () => {
    it('should send paratemer id to service (delete fucntion) and remove designated object data from database', async () => {
      const id = 'med-uuid-456';
      const mockDeletedResult = {
        id,
        medicineName: 'Amoxicillin',
        sku: 'SKU-90',
        categoryId: 'cat-2',
        supplierId: 'sup-2',
        stock: 150,
        price: 30000,
        expiredDate: '2026-06-10',
      };

      mockMedicineService.remove.mockResolvedValue(mockDeletedResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('id', id);
      expect(result).not.toBeNull();
    });
  });
});
