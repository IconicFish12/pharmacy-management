import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, expect, describe, it, vi } from 'vitest';
import { MedicineOrderController } from '../../../../../src/module/medicine-module/medicine-order/medicine-order.controller.ts';
import { MedicineOrderService } from '../../../../../src/module/medicine-module/medicine-order/medicine-order.service.ts';
import { RolesGuard } from '../../../../../src/common/guards/roles.guard.ts';
import { AuthGuard } from '@nestjs/passport';

describe('MedicineOrderController', () => {
  let controller: MedicineOrderController;
  let service: MedicineOrderService;

  const mockService = {
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
      controllers: [MedicineOrderController],
      providers: [
        {
          provide: MedicineOrderService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<MedicineOrderController>(MedicineOrderController);
    service = module.get<MedicineOrderService>(MedicineOrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should extract query parameter and call function MedicineService.findAll', async () => {
      const page = 1;
      const perPage = 10;
      mockService.findAll.mockResolvedValue({ data: [], meta: {} });

      const result = await controller.findAll(page, perPage);

      expect(service.findAll).toHaveBeenCalledWith(page, perPage);
      expect(result).toHaveProperty('data');
    });
  });

  describe('GET /:id', () => {
    it('should send id parameter to service', async () => {
      const id = '0d060b0c-2ef5-4425-984a-2974182c1731';
      mockService.findOne.mockResolvedValue({ id, name: 'Infus' });

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('name', 'Infus');
    });
  });

  describe('PATCH /:id', () => {
    it('should receive id patameter and dto object then forward it to MedicineService.update', async () => {
      const id = '0d060b0c-2ef5-4425-984a-2974182c1731';
      const updateDto = { description: 'Obat Infus' };
      const mockUpdatedResult = {
        id,
        categoryName: 'Infus',
        description: 'Obat Infus',
        createdAt: new Date('2026-05-15T14:44:28.088Z'),
        updatedAt: new Date('2026-05-15T14:44:28.088Z'),
      };

      mockService.update.mockResolvedValue(mockUpdatedResult);

      const result = await controller.update(id, updateDto as any);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toHaveProperty('description', 'Obat Infus');
      expect(result).toHaveProperty('id', id);
    });
  });

  describe('DELETE /:id', () => {
    it(' should send parameter id to service.remove', async () => {
      const id = '0d060b0c-2ef5-4425-984a-2974182c1731';
      const mockDeletedResult = {
        id,
        categoryName: 'Infus',
        description: 'Obat Infus',
        createdAt: new Date('2026-05-15T14:44:28.088Z'),
        updatedAt: new Date('2026-05-15T14:44:28.088Z'),
      };

      mockService.remove.mockResolvedValue(mockDeletedResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('id', id);
      expect(result).not.toBeNull();
    });
  });
});
