import {
  IsAlphanumeric,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsUUID,
} from 'class-validator';
import { OrderStatus } from '../../../../common/database/generated/prisma/enums.js';
import { Type } from 'class-transformer';

export class CreateMedicineOrderDto {
  @IsNotEmpty({
    message: 'medicine name is required',
  })
  medicineName: string;

  @IsNotEmpty({
    message: 'medicine order code is required',
  })
  @IsAlphanumeric('en-US', {
    message: 'medicine ordr code mus contain letter and number',
  })
  orderCode: string;

  @IsNotEmpty({
    message: 'medicine order date is required',
  })
  @Type(() => Date)
  @IsDate()
  orderDate: Date;

  @IsNotEmpty({
    message: 'medicine orderer is required',
  })
  @IsUUID('7')
  userId: string;

  @IsNotEmpty({
    message: 'medicie supplier is required',
  })
  supplierId: string;

  @IsNotEmpty({
    message: 'total price is required',
  })
  @IsPositive()
  totalPrice: number;

  @IsNotEmpty({
    message: 'order status is required',
  })
  @IsEnum(OrderStatus, {
    message:
      'order status not valid choose between PENDING, COMPLETED, and CANCELLED',
  })
  status: OrderStatus;
}
