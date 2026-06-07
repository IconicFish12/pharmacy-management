import { Test, TestingModule } from '@nestjs/testing';
import { vi, beforeEach, afterEach, expect, describe, it } from 'vitest';
import { SupplierController } from '../../../../../src/module/user-manage-module/supplier-module/supplier.controller.ts';
import { SupplierService } from '../../../../../src/module/user-manage-module/supplier-module/supplier.service.ts';
import { RolesGuard } from '../../../../../src/common/guards/roles.guard.ts';
import { AuthGuard } from '@nestjs/passport';

describe('SupplierController', () => {
  let controller: SupplierController;
  let service: SupplierService;

  const mockService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  const mockRolesGuard = { canActivate: true };
  const mockAuthGuard = { canActivate: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierController],
      providers: [
        {
          provide: SupplierService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<SupplierController>(SupplierController);
    service = module.get<SupplierService>(SupplierService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('should forward dto data to create function in service', async () => {
      const dto = {
        companyName: 'Kimia Farma',
        phoneNumber: '0811345169881',
        contactName: 'Irwan Pratama',
        supplierEmail: 'inasilverne@gmail.com',
        status: 'ACTIVE',
        address: 'Jln.Katamso',
        licenseNumber: 88712,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.create.mockResolvedValue({
        id: '75a9642f-fedb-4e72-b04b-2f36dfad00ab',
        ...dto,
      });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty(
        'id',
        '75a9642f-fedb-4e72-b04b-2f36dfad00ab',
      );
    });
  });

  describe('GET /', () => {
    it('should extract query parameter and call fucntion SupplierService.findAll', async () => {
      const page = 1;
      const perPage = 10;
      mockService.findAll.mockResolvedValue({ data: [], meta: {} });

      const result = await controller.findAll(page, perPage);

      expect(service.findAll).toHaveBeenCalledWith(page, perPage);
      expect(result).toHaveProperty('data');
    });
  });

  describe('GET /:id', () => {
    it('should send id paramater to service', async () => {
      const id = '75a9642f-fedb-4e72-b04b-2f36dfad00ab';
      mockService.findOne.mockResolvedValue({
        companyName: 'Kimia Farma',
        phoneNumber: '0811345169881',
        contactName: 'Irwan Pratama',
        supplierEmail: 'inasilverne@gmail.com',
        status: 'ACTIVE',
        address: 'Jln.Katamso',
        licenseNumber: 88712,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('companyName', 'Kimia Farma');
    });
  });

  describe('PATCH /:id', () => {
    it('should receive id patameter and dto object then forward it to MedicineService.update', async () => {
      const id = '75a9642f-fedb-4e72-b04b-2f36dfad00ab';
      const updateDto = {
        companyName: 'Supplier A',
        contactName: 'Indrak',
        status: 'INACTIVE',
      };
      const mockUpdatedResult = {
        id,
        companyName: 'Supplier A',
        phoneNumber: '0811345169881',
        contactName: 'Indark',
        supplierEmail: 'inasilverne@gmail.com',
        status: 'INACTIVE',
        address: 'Jln.Katamso',
        licenseNumber: 88712,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.update.mockResolvedValue(mockUpdatedResult);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toHaveProperty('companyName', 'Supplier A');
      expect(result).toHaveProperty('id', id);
    });
  });

  describe('DELETE /:id', () => {
    it(' should send parameter id to MedicineService.remove and return removed medicine category data', async () => {
      const id = '75a9642f-fedb-4e72-b04b-2f36dfad00ab';
      const mockDeletedResult = {
        id,
        companyName: 'Supplier A',
        phoneNumber: '0811345169881',
        contactName: 'Indark',
        supplierEmail: 'inasilverne@gmail.com',
        status: 'INACTIVE',
        address: 'Jln.Katamso',
        licenseNumber: 88712,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockService.remove.mockResolvedValue(mockDeletedResult);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toHaveProperty('id', id);
      expect(result).not.toBeNull();
    });
  });
});
