import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineDto } from './dto/create-medicine.dto.js';
import { UpdateMedicineDto } from './dto//update-medicine.dto.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/pagination/pagination.js';
import {
  Medicine,
  Prisma,
} from '../../../common/database/generated/prisma/client.js';
import { DatabaseService } from '../../../common/database/database.service.js';
import {
  MedicineCreateInput,
  MedicineUpdateInput,
} from '../../../common/database/generated/prisma/models.js';

const paginate = paginator({ perPage: 10, page: 1 });

type MedicineWithRelations = Prisma.MedicineGetPayload<{
  include: {
    _count: true;
    category: true;
    supplier: true;
  };
}>;

@Injectable()
export class MedicineService {
  private readonly logger = new Logger(MedicineService.name);
  constructor(private prisma: DatabaseService) {}

  async create(
    dto: CreateMedicineDto,
  ): Promise<Medicine | MedicineCreateInput> {
    return await this.prisma.medicine.create({
      data: dto,
    });
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Medicine>> {
    return paginate(
      this.prisma.medicine,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<MedicineWithRelations> {
    return this.prisma.medicine.findUniqueOrThrow({
      where: { id: id },
      include: {
        _count: true,
        category: true,
        supplier: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateMedicineDto,
  ): Promise<Medicine | MedicineUpdateInput> {
    return await this.prisma.medicine.update({
      where: { id: id },
      data: dto,
    });
  }

  async remove(id: string): Promise<Medicine> {
    return await this.prisma.medicine.delete({
      where: { id: id },
    });
  }
}
