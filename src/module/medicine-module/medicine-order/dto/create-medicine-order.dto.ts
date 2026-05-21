import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../../../../database/generated/prisma/enums.js';
import { Type } from 'class-transformer';
import { Medicines } from '../interfaces/medicines.interface.js';
import { MedicinesDto } from './medicines.dto.js';

export class CreateMedicineOrderDto {
  @IsNotEmpty({ message: 'medicine order date is required' })
  @Type(() => Date)
  @IsDate()
  readonly orderDate!: Date;

  @IsOptional()
  @IsUUID('all')
  employeeId!: string;

  @IsNotEmpty({ message: 'medicine supplier is required' })
  @IsUUID('all')
  readonly supplierId!: string;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'order status not valid: PENDING, COMPLETED, CANCELLED',
  })
  readonly status!: OrderStatus;

  @IsNotEmpty({ message: 'medicines to order is required' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicinesDto)
  medicines!: Array<Medicines>;
}
