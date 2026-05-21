import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateMedicineOrderDto } from './dto/create-medicine-order.dto.js';
import { UpdateMedicineOrderDto } from './dto/update-medicine-order.dto.js';
import {
  MedicineOrder,
  Prisma,
} from '../../../database/generated/prisma/client.js';
import { MedicineUpdateInput } from '../../../database/generated/prisma/models.js';
import {
  PaginatedResult,
  paginator,
} from '../../../common/helpers/pagination/pagination.js';
import { DatabaseService } from '../../../database/database.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Medicines } from './interfaces/medicines.interface.js';
const paginate = paginator({ perPage: 10, page: 1 });

type MedicineOrderWithRelations = Prisma.MedicineOrderGetPayload<{
  include: { _count: true; supplier: true; employee: true };
}>;

@Injectable()
export class MedicineOrderService {
  private readonly logger = new Logger(MedicineOrderService.name);
  constructor(
    private prisma: DatabaseService,
    private event: EventEmitter2,
  ) {}

  // Issue #1
  async create(dto: CreateMedicineOrderDto): Promise<MedicineOrder> {
    const { supplierId, employeeId, medicines, ...request } = dto;

    return await this.prisma.$transaction(async (tx) => {
      let grandTotal = 0;

      const orderItemsData: {
        medicineId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }[] = [];

      for (const item of medicines) {
        // 1. Validasi medicine exist
        const medicine = await tx.medicine.findUnique({
          where: { id: item.medicineId },
        });

        if (!medicine) {
          throw new NotFoundException(
            `Medicine dengan ID ${item.medicineId} tidak ditemukan.`,
          );
        }

        await tx.medicine.update({
          where: { id: item.medicineId },
          data: { stock: { increment: item.quantity } },
        });

        const subtotal = item.unitPrice * item.quantity;
        grandTotal += subtotal;

        orderItemsData.push({
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal,
        });
      }

      // Generate order code
      const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const order = await tx.medicineOrder.create({
        data: {
          ...request,
          orderCode,
          totalPrice: grandTotal,
          employee: { connect: { id: employeeId } },
          supplier: { connect: { id: supplierId } },
          orderDetails: {
            create: orderItemsData,
          },
        },
        include: {
          orderDetails: true,
        },
      });

      this.logger.log(
        `Purchase Order ${order.orderCode} dibuat. Total: ${grandTotal}. ` +
          `${medicines.length} item obat di-restock.`,
      );

      return order;
    });
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
        omit: { employeeId: true, supplierId: true },
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
        employee: true,
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
