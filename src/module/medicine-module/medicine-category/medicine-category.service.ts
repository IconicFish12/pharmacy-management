import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineCategoryDto } from './dto/create-medicine-category.dto.js';
import { UpdateMedicineCategoryDto } from './dto/update-medicine-category.dto.js';
import { PaginatedResult, paginator } from '../../../common/pagination/pagination.js';
import { MedicineCategory } from '../../../common/database/generated/prisma/client.js';
import { DatabaseService } from '../../../common/database/database.service.js';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class MedicineCategoryService {
  private readonly logger = new Logger(MedicineCategoryService.name);
  constructor(private prisma: DatabaseService) {}

  async create(createMedicineCategoryDto: CreateMedicineCategoryDto) {
    return 'This action adds a new medicineCategory';
  }

  async findAll(page: number, perPage: number): Promise<PaginatedResult<MedicineCategory>>{
    return await paginate(
      this.prisma.medicineCategory,
      {
        orderBy: {
          createdAt: 'desc'
        }
      },
      {
        page,
        perPage
      }
    );
  }

  async findOne(id: string) {
    return `This action returns a #${id} medicineCategory`;
  }

  async update(id: string, updateMedicineCategoryDto: UpdateMedicineCategoryDto) {
    return `This action updates a #${id} medicineCategory`;
  }

  async remove(id: string) {
    return `This action removes a #${id} medicineCategory`;
  }
}
