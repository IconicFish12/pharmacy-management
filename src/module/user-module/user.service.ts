import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DatabaseService } from '../../common/database/database.service.js';
import { PaginatedResult, paginator } from '../../common/pagination/pagination.js';
import { Prisma, User } from '../../common/database/generated/prisma/client.js';

const paginate = paginator({ perPage: 10, page: 1 });

type UserDataWithRelation = Prisma.UserGetPayload<{
  include: {
    medicineOrders: true,
    transactions: true,
  };
}>;

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);
  constructor(private prisma: DatabaseService) {}
  async create(dto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: dto,
    });
  }

  async findAll(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<User>> {
    return await paginate(
      this.prisma.medicineCategory,
      { orderBy: { createdAt: 'desc' } },
      { page, perPage },
    );
  }

  async findOne(id: string): Promise<UserDataWithRelation> {
    const supplier = await this.prisma.user.findUnique({
      where: { id },
      include: {
        _count: true,
        medicineOrders: true,
        transactions: true,
      },
    });

    if (!supplier) {
      throw new NotFoundException(`supplier with ID ${id} not found`);
    }

    return supplier;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
