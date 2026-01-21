import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';
import {
  MedicineOrder,
  Prisma,
} from '../../../common/database/generated/prisma/client.js';
import {
  MedicineOrderCreateInput,
  MedicineUpdateInput,
} from '../../../common/database/generated/prisma/models.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/pagination/pagination.js';
import { DatabaseService } from '../../../common/database/database.service.js';

const paginate = paginator({ perPage: 10, page: 1 });

type MedicineOrderWithRelations = Prisma.MedicineOrderGetPayload<{
  include: { _count: true; supplier: true; user: true };
}>;

@Injectable()
export class MedicineOrderService {
  private readonly logger = new Logger(MedicineOrderService.name);
  constructor(private prisma: DatabaseService) {}

  async create(
    dto: CreateMedicineOrderDto,
  ): Promise<MedicineOrder | MedicineOrderCreateInput> {
    return await this.prisma.medicineOrder.create({
      data: dto,
    });
  }

  async findAll(
    perPage?: number,
    page?: number,
  ): Promise<PaginatedResult<MedicineOrder>> {
    return await paginate(
      this.prisma.medicineOrder,
      { orderBy: { createdAt: 'desc' } },
      { perPage, page },
    );
  }

  async findOne(id: string): Promise<MedicineOrderWithRelations> {
    return await this.prisma.medicineOrder.findUniqueOrThrow({
      where: { id: id },
      include: {
        _count: true,
        supplier: true,
        user: true,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateMedicineOrderDto,
  ): Promise<MedicineOrder | MedicineUpdateInput> {
    return await this.prisma.medicineOrder.update({
      where: { id: id },
      data: dto,
    });
  }

  async remove(id: string): Promise<MedicineOrder> {
    return await this.prisma.medicineOrder.delete({
      where: { id: id },
    });
  }
}
