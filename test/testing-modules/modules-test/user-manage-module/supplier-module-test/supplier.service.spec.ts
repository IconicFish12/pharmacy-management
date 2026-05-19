import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from 'src/module/user-manage-module/supplier-module/supplier.service';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundException } from '@nestjs/common';

const mockDatabase = {
  supplier: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('SupplierService', () => {
  let service: SupplierService;
  let database: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    database = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Function create test', () => {
    it('should create data supplier from create dto object', async () => {
      const mockDto = {
        companyName: 'Supplier A',
        phoneNumber: '081231445678',
        contactName: 'Ahmad',
        supplierEmail: 'inagoldme@gmail.com',
        status: 'ACTIVE',
        address: 'Jln.Supratman',
        licenseNumber: 76551,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabase.supplier.create.mockResolvedValue({
        id: 'd519aab3-f508-435f-bec4-3ccde7bc12ae',
        ...mockDto,
      });

      const result = await service.create(mockDto);

      expect(mockDatabase.supplier.create).toHaveBeenCalled();
      expect(result).toHaveProperty(
        'id',
        'd519aab3-f508-435f-bec4-3ccde7bc12ae',
      );
    });
  });

  describe('Function findAll test', () => {
    it('should returning supplier object data', async () => {
      const mockData = [
        {
          id: 'd519aab3-f508-435f-bec4-3ccde7bc12ae',
          companyName: 'Supplier A',
          phoneNumber: '081231445678',
          contactName: 'Ahmad',
          supplierEmail: 'inagoldme@gmail.com',
          status: 'ACTIVE',
          address: 'Jln.Supratman',
          licenseNumber: 76551,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '75a9642f-fedb-4e72-b04b-2f36dfad00ab',
          companyName: 'Supplier B',
          phoneNumber: '0811345169881',
          contactName: 'Sari',
          supplierEmail: 'inasilverne@gmail.com',
          status: 'INACTIVE',
          address: 'Jln.Katamso',
          licenseNumber: 88712,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockDatabase.supplier.findMany.mockResolvedValue(mockData);
      mockDatabase.supplier.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(mockDatabase.supplier.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: 10,
          skip: 0,
        }),
      );

      expect(mockDatabase.supplier.count).toHaveBeenCalled();
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.data[0].companyName).toBe('Supplier A');
    });
  });

  describe('Function findOne test', () => {
    it('should find and return a supplier data object', async () => {
      const mockData = {
        id: 'd519aab3-f508-435f-bec4-3ccde7bc12ae',
        companyName: 'Supplier A',
        phoneNumber: '081231445678',
        contactName: 'Ahmad',
        supplierEmail: 'inagoldme@gmail.com',
        status: 'ACTIVE',
        address: 'Jln.Supratman',
        licenseNumber: 76551,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockDatabase.supplier.findUnique.mockResolvedValue(mockData);

      const result = await service.findOne(
        'd519aab3-f508-435f-bec4-3ccde7bc12ae',
      );

      expect(mockDatabase.supplier.findUnique).toHaveBeenCalledWith({
        where: { id: 'd519aab3-f508-435f-bec4-3ccde7bc12ae' },
        include: {
          medicines: { orderBy: { createdAt: 'desc' } },
          medicineOrders: { orderBy: { createdAt: 'desc' } },
        },
      });

      expect(result).toEqual(mockData);
    });

    it('should returning NotFoundException when supplier data is not found', async () => {
      const id = 'invalid';

      mockDatabase.supplier.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`supplier with ID ${id} not found`),
      );

      expect(mockDatabase.supplier.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: {
          medicines: { orderBy: { createdAt: 'desc' } },
          medicineOrders: { orderBy: { createdAt: 'desc' } },
        },
      });
    });
  });

  describe('Function update test', () => {
    it('should update supplier data from update object data', async () => {
      const id = '75a9642f-fedb-4e72-b04b-2f36dfad00ab';
      const updatedData = {
        companyName: 'Kimia Farma',
        contactName: 'Irwan Pratama',
        status: 'ACTIVE',
      };
      const mockUpdatedData = {
        id,
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

      mockDatabase.supplier.update.mockResolvedValue(mockUpdatedData);

      const result = await service.update(id, updatedData);

      expect(mockDatabase.supplier.update).toHaveBeenCalledWith({
        where: { id },
        data: updatedData,
      });

      expect(result).toHaveProperty('companyName', 'Kimia Farma');
    });
  });

  describe('Function remove testing', () => {
    it('Should remove / delete supplier data object', async () => {
      const id = '75a9642f-fedb-4e72-b04b-2f36dfad00ab';
      const mockData = {
        id,
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

      mockDatabase.supplier.delete.mockResolvedValue(mockData);

      const result = await service.remove(id);

      expect(mockDatabase.supplier.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockData);
    });
  });
});
