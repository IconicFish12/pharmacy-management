import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';
import { DatabaseService } from 'src/database/database.service';
import { NotFoundException } from '@nestjs/common';

const mockDatabase = {
  medicineCategory: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
   delete: jest.fn(),
  },
};

describe('MedicineCategoryService - Unit Testing - Medicine Module', () => {
  let service: MedicineCategoryService;
  let database: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicineCategoryService,
        {
          provide: DatabaseService,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    service = module.get<MedicineCategoryService>(MedicineCategoryService);
    database = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fuction Testing - create', () => {
    it('Should been create an medicine category data object', async () => {
      const dto = {
        categoryName: 'Pain killer',
        description: 'Types of drugs to relieve or eliminate pain',
      };

      mockDatabase.medicineCategory.create.mockResolvedValue({
        id: '297bd7b7-3a36-4ad4-ade0-fc93ec736aac',
        ...dto,
      });

      const result = await service.create(dto);

      expect(mockDatabase.medicineCategory.create).toHaveBeenCalled();
      expect(result).toHaveProperty(
        'id',
        '297bd7b7-3a36-4ad4-ade0-fc93ec736aac',
      );
    });
  });

  describe('Function Testing - findAll', () => {
    it('Should been shows medicine category object data', async () => {
      const mockdata = [
        {
          id: '297bd7b7-3a36-4ad4-ade0-fc93ec736aac',
          categoryName: 'Pain Killer',
          description: 'Types of drugs to relieve or eliminate pain',
          createdAt: new Date('2026-05-15T14:44:28.088Z'),
          updatedAt: new Date('2026-05-15T14:44:28.088Z'),
        },
        {
          id: 'fe4bfe04-3247-4ee1-a99f-2d413372c3f3',
          categoryName: 'testing1',
          createdAt: new Date('2026-05-15T14:29:18.961Z'),
          updatedAt: new Date('2026-05-15T14:29:18.961Z'),
        },
      ];

      mockDatabase.medicineCategory.findMany.mockResolvedValue(mockdata);
      mockDatabase.medicineCategory.count.mockResolvedValue(2);

      const result = await service.findAll(1, 10);

      expect(mockDatabase.medicineCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: 'desc' },
          take: 10,
          skip: 0,
        }),
      );
      expect(mockDatabase.medicineCategory.count).toHaveBeenCalled();
      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.data[0].categoryName).toBe('Pain Killer');
    });
  });

  describe('Function testing - findOne', () => {
    it('Should shown unique medicine category data object', async () => {
      const mockData = {
        id: '297bd7b7-3a36-4ad4-ade0-fc93ec736aac',
        categoryName: 'Pain Killer',
        description: 'Types of drugs to relieve or eliminate pain',
        createdAt: new Date('2026-05-15T14:44:28.088Z'),
        updatedAt: new Date('2026-05-15T14:44:28.088Z'),
      };

      mockDatabase.medicineCategory.findUnique.mockResolvedValue(mockData);

      const result = await service.findOne(
        '297bd7b7-3a36-4ad4-ade0-fc93ec736aac',
      );

      expect(mockDatabase.medicineCategory.findUnique).toHaveBeenCalledWith({
        where: { id: '297bd7b7-3a36-4ad4-ade0-fc93ec736aac' },
        include: { medicines: { orderBy: { createdAt: 'desc' } } },
      });
      expect(result).toEqual(mockData);
    });

    it('should shown notFoundExeception when medicine category is not found', async () => {
        const id ='invalid';
      mockDatabase.medicineCategory.findUnique.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Category with ID ${id} not found`),
      );

      expect(mockDatabase.medicineCategory.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: { medicines: { orderBy: { createdAt: 'desc' } } },
      });
    });
  });

  describe('Function testing - update', () => {
    it('Should update medicine category data object', async () => {
      const id = '297bd7b7-3a36-4ad4-ade0-fc93ec736aac';
      const updatedData = { description: 'descc testing' };
      const mockUpdatedData = {
        id,
        name: 'Pain Killer',
        description: 'descc testing',
      };

      mockDatabase.medicineCategory.update.mockResolvedValue(mockUpdatedData);

      const result = await service.update(id, updatedData);

      expect(mockDatabase.medicineCategory.update).toHaveBeenCalledWith({
        where: { id },
        data: updatedData,
      });

      expect(result).toHaveProperty('description', 'descc testing');
    });
  });

  describe('Function testing - remove', () => {
    it('Should remove / delete medicine category data pbject', async () => {
      const id = '297bd7b7-3a36-4ad4-ade0-fc93ec736aac';
      const mockData = { id, name: 'Pain Killer' };

      mockDatabase.medicineCategory.delete.mockResolvedValue(mockData);

      const result = await service.remove(id);

      expect(mockDatabase.medicineCategory.delete).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(mockData);
    });
  });
});
