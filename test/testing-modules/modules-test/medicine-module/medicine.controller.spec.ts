import { Test, TestingModule } from '@nestjs/testing';
import { MedicineController } from '../../../../src/module/medicine-module/medicine/medicine.controller';
import { MedicineService } from '../../../../src/module/medicine-module/medicine/medicine.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../../src/common/guards/roles.guard';

describe('MedicineController (Integration Testing - Gray Box)', () => {
  let controller: MedicineController;
  let service: MedicineService;

  const mockMedicineService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
    jest.clearAllMocks();
  });

  describe('POST /', () => {
    it('harus meneruskan dto ke MedicineService.create', async () => {
      const dto = {
        name: 'Amoxicillin',
        sku: 'SKU-90',
        categoryId: 'cat-2',
        supplierId: 'sup-2',
        stock: 50,
        price: 30000,
        expiredDate: '2026-06-10',
      };
      mockMedicineService.create.mockResolvedValue({ id: 'med-2', ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', 'med-2');
    });
  });

  describe('GET /', () => {
    it('harus mengekstrak query parameter dan memanggil MedicineService.findAll', async () => {
      const page = 1;
      const perPage = 10;
      mockMedicineService.findAll.mockResolvedValue({ data: [], meta: {} });

      const result = await controller.findAll(page, perPage);

      expect(service.findAll).toHaveBeenCalledWith(page, perPage);
      expect(result).toHaveProperty('data');
    });
  });

  describe('GET /:id', () => {
    it('harus mengirimkan parameter ID dengan benar ke service', async () => {
      const id = 'uuid-string';
      mockMedicineService.findOne.mockResolvedValue({ id, name: 'Obat Batuk' });

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('name', 'Obat Batuk');
    });
  });

  describe('PATCH /:id', () => {
    it('harus menerima parameter id dan objek dto lalu meneruskannya ke MedicineService.update', async () => {
      const id = 'med-uuid-123';
      const updateDto = { stock: 150 };
      const mockUpdatedResult = {
        id,
        name: 'Amoxicillin',
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
    it('harus mengirimkan parameter id dengan benar ke MedicineService.remove dan mengembalikan data obat yang dihapus', async () => {
      const id = 'med-uuid-456';
      const mockDeletedResult = {
        id,
        name: 'Amoxicillin',
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
