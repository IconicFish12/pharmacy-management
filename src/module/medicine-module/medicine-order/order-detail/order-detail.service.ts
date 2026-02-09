import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../../common/database/database.service.js';
import {
  PaginatedResult,
  paginator,
} from '../../../../common/pagination/pagination.js';
import { OrderDetail } from '../../../../common/database/generated/prisma/client.js';

const paginate = paginator({ perPage: 10, page: 1 });

@Injectable()
export class OrderDetailService {
  private readonly logger = new Logger(OrderDetailService.name);
  constructor(private readonly prisma: DatabaseService) {}

  async findAll(
    perPage: number,
    page: number,
  ): Promise<PaginatedResult<OrderDetail>> {
    return paginate(
      this.prisma.orderDetail,
      {
        orderBy: { createdAt: 'desc' },
        include: {
          order: { omit: { id: true } },
          medicine: { omit: { id: true } },
        },
      },
      { perPage, page },
    );
  }

  async delete(medicineId: string, orderId: string) {
    return await this.prisma.orderDetail.deleteMany({
      where: { AND: [{ medicineId: medicineId }, { orderId: orderId }] },
    });
  }
}
