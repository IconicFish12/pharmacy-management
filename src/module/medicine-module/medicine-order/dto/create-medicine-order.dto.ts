import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { OrderStatus } from '../../../../common/database/generated/prisma/enums.js';
import { Type } from 'class-transformer';
import { Medicines } from '../interfaces/medicines.interface.js';

export class CreateMedicineOrderDto {
  @IsNotEmpty({
    message: 'medicine order date is required',
  })
  @Type(() => Date)
  @IsDate()
  readonly orderDate!: Date;

  @IsOptional({
    message: 'medicine orderer is optional',
  })
  @IsUUID('all')
  userId!: string;

  @IsNotEmpty({
    message: 'medicine supplier is required',
  })
  @IsUUID('all')
  readonly supplierId!: string;

  @IsOptional({
    message: 'order status is optional',
  })
  @IsEnum(OrderStatus, {
    message:
      'order status not valid choose between PENDING, COMPLETED, and CANCELLED',
  })
  readonly status!: OrderStatus;

  @IsNotEmpty({
    message: 'medicines to order is required',
  })
  medicines!: Array<Medicines>;
}
