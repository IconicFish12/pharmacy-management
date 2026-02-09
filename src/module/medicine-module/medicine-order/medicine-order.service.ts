import { Injectable, Logger } from '@nestjs/common';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';
import {
  MedicineOrder,
  Prisma,
} from '../../../common/database/generated/prisma/client.js';
import { MedicineUpdateInput } from '../../../common/database/generated/prisma/models.js';
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
    id?: string,
  ): Promise<MedicineOrder> {
    const { supplierId, userId, medicines, ...request } = dto;

    const totalOrderPrice = medicines.reduce((acc, item) => {
      return item.unit_price * item.quantity;
    }, 0);

    return await this.prisma.$transaction(
      async (tx) => {
        return await tx.medicineOrder.create({
          data: {
            ...request,
            orderCode: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
            totalPrice: totalOrderPrice,
            user: {
              connect: { id: id ?? userId },
            },
            supplier: {
              connect: { id: supplierId },
            },
            orderDetails: {
              create: medicines.map((item) => ({
                medicine: {
                  connect: { id: item.medicineId },
                },
                quantity: item.quantity,
                unitPrice: item.unit_price,
                subtotal: item.unit_price * item.quantity,
              })),
            },
          },
          include: {
            orderDetails: true,
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );
  }

  async findAll(
    perPage: number,
    page: number,
  ): Promise<PaginatedResult<MedicineOrder>> {
    return await paginate(
      this.prisma.medicineOrder,
      {
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: { omit: { id: true } },
          user: { omit: { id: true } },
        },
        omit: { userId: true, supplierId: true },
      },
      { page, perPage },
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
