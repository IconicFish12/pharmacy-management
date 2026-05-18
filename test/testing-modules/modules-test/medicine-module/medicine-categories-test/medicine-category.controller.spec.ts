import { Test, TestingModule } from '@nestjs/testing';
import { MedicineCategoryController } from 'src/module/medicine-module/medicine-category/medicine-category.controller';
import { MedicineCategoryService } from 'src/module/medicine-module/medicine-category/medicine-category.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport'

describe('MedicineCategoryController - integration testing - medicine module', () => {
  let controller: MedicineCategoryController;
  let service: MedicinCategoryService;

  const mockService = {
   create: jest.fn(),
   findAll: jest.fn(),
   findOne: jest.fn(),
   update: jest.fn(),
   remove: jest.fn(),
  }

  const mockAuthGuard = { canActivate: () => true};
  const mockRolesGuard = { canActivate: () => true };

  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicineCategoryController],
      providers: [
          {
              provide: MedicineCategoryService,
              useValue: mockService,
          }
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard).compile();

    controller = module.get<MedicineCategoryController>(
      MedicineCategoryController,
    );
    service = module.get<MedicineCategoryService>(MedicineCategoryService);
  });

  afterEach(() => {
      jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /', () => {
    it('should forward dto data to create function in service', async () => {
      const dto = {
        categoryName: 'Infus',
        description: 'Types of drugs to relieve or eliminate pain',
        createdAt: new Date('2026-05-15T14:44:28.088Z'),
        updatedAt: new Date('2026-05-15T14:44:28.088Z'),
      };

      mockService.create.mockResolvedValue({ id: '0d060b0c-2ef5-4425-984a-2974182c1731', ...dto });

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id', '0d060b0c-2ef5-4425-984a-2974182c1731');
    });
  });

  describe('GET /', () => {
    it('should extract query parameter and call fucntion MedicineService.findAll', async () => {
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

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toHaveProperty('description', 'Obat Infus');
      expect(result).toHaveProperty('id', id);
    });
  });

  describe('DELETE /:id', () => {
    it(' should send parameter id to MedicineService.remove and return removed medicine category data', async () => {
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
